import { Inject, Provide } from '@midwayjs/decorator';
import { DataSource, FindOptionsOrder, IsNull } from 'typeorm';
import { InjectDataSource, InjectEntityModel } from '@midwayjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BaseService } from '../../../common/base.service';
import { MenuEntity } from '../entity/menu';
import { R } from '../../../common/base.error.util';
import { MenuApiEntity } from '../entity/menu.api';
import { MenuDTO } from '../dto/menu';
import { RoleMenuEntity } from '../../role/entity/role.menu';
import { CasbinRule } from '@midwayjs/casbin-typeorm-adapter';
import { CasbinEnforcerService } from '@midwayjs/casbin';

@Provide()
export class MenuService extends BaseService<MenuEntity> {
  @InjectEntityModel(MenuEntity)
  menuModel: Repository<MenuEntity>;
  @InjectEntityModel(MenuApiEntity)
  menuApiModel: Repository<MenuApiEntity>;
  @InjectEntityModel(RoleMenuEntity)
  roleMenuModel: Repository<RoleMenuEntity>;
  @InjectDataSource()
  defaultDataSource: DataSource;
  @InjectEntityModel(CasbinRule)
  casbinModel: Repository<CasbinRule>;
  @Inject()
  casbinEnforcerService: CasbinEnforcerService;

  getModel(): Repository<MenuEntity> {
    return this.menuModel;
  }

  async createMenu(data: MenuDTO) {
    if (
      data.route &&
      (await this.menuModel.countBy({ route: data.route })) > 0
    ) {
      throw R.error('路由不能重复');
    }

    if (
      data.authCode &&
      (await this.menuModel.countBy({ authCode: data.authCode })) > 0
    ) {
      throw R.error('权限代码不能重复');
    }

    const entity = data.toEntity();

    await this.create(entity);

    const menuApis = data.apis.map(api => {
      const menuApi = new MenuApiEntity();
      menuApi.menuId = entity.id;
      menuApi.path = api.path;
      menuApi.method = api.method;
      return menuApi;
    });

    await this.menuApiModel
      .createQueryBuilder()
      .insert()
      .values(menuApis)
      .execute();

    return entity;
  }

  async editMenu(data: MenuDTO) {
    const entity = data.toEntity();

    this.defaultDataSource.transaction(async manager => {
      const tasks = [];

      manager.delete(MenuApiEntity, {});

      manager
        .createQueryBuilder()
        .delete()
        .from(MenuApiEntity)
        .where({ menuId: entity.id })
        .execute();

      tasks.push(manager.save(MenuEntity, entity));

      const roleMenus = await this.roleMenuModel.findBy({ menuId: entity.id });

      tasks.push(
        manager
          .createQueryBuilder()
          .delete()
          .from(CasbinRule)
          .where({ v3: entity.id })
          .execute()
      );

      const menuApis = data.apis.map(api => {
        const menuApi = new MenuApiEntity();
        menuApi.menuId = entity.id;
        menuApi.path = api.path;
        menuApi.method = api.method;
        return menuApi;
      });

      tasks.push(
        manager
          .createQueryBuilder()
          .insert()
          .into(MenuApiEntity)
          .values(menuApis)
          .execute()
      );

      const casbinRules = roleMenus.reduce((prev, cur) => {
        prev.push(
          ...data.apis.map(api => {
            return this.casbinEnforcerService.addPermissionForUser(
              entity.id,
              api.path,
              api.method,
              cur.menuId
            );
          })
        );
        return prev;
      }, []);

      tasks.push(Promise.all(casbinRules));

      await Promise.all(tasks);

      await this.casbinEnforcerService.savePolicy();
    });

    return entity;
  }

  async page(
    page: number,
    pageSize: number,
    where?: FindOptionsWhere<MenuEntity>
  ) {
    if (where) {
      where.parentId = IsNull();
    } else {
      where = { parentId: IsNull() };
    }

    const order: FindOptionsOrder<MenuEntity> = { orderNumber: 'ASC' };

    const [data, total] = await this.menuModel.findAndCount({
      where,
      order,
      skip: page * pageSize,
      take: pageSize,
    });

    if (!data.length) return { data: [], total: 0 };

    const ids = data.map((o: MenuEntity) => o.id);
    const countMap = await this.menuModel
      .createQueryBuilder('menu')
      .select('COUNT(menu.parentId)', 'count')
      .addSelect('menu.parentId', 'id')
      .where('menu.parentId IN (:...ids)', { ids })
      .groupBy('menu.parentId')
      .getRawMany();

    const result = data.map((item: MenuEntity) => {
      const count =
        countMap.find((o: { id: string; count: number }) => o.id === item.id)
          ?.count || 0;

      return {
        ...item,
        hasChild: Number(count) > 0,
      };
    });

    return { data: result, total };
  }

  async getChildren(parentId?: string) {
    if (!parentId) {
      throw R.validateError('父节点id不能为空');
    }
    const data = await this.menuModel.find({
      where: { parentId: parentId },
      order: { orderNumber: 'ASC' },
    });
    if (!data.length) return [];

    const ids = data.map((o: any) => o.id);
    const countMap = await this.menuModel
      .createQueryBuilder('menu')
      .select('COUNT(menu.parentId)', 'count')
      .addSelect('menu.parentId', 'id')
      .where('menu.parentId IN (:...ids)', { ids })
      .groupBy('menu.parentId')
      .getRawMany();

    const result = data.map((item: any) => {
      const count = countMap.find(o => o.id === item.id)?.count || 0;
      return {
        ...item,
        hasChild: Number(count) > 0,
      };
    });

    return result;
  }

  async getAllocInterfaceByMenu(menuId: string) {
    const menuInterfaces = await this.menuApiModel.findBy({
      menuId,
    });
    return menuInterfaces;
  }

  async removeMenu(id: string) {
    await this.menuModel
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .orWhere('parentId = :id', { id })
      .execute();
  }
}
