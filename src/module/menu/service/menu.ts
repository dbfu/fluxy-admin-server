import { Provide } from '@midwayjs/decorator';
import { DataSource, FindOptionsOrder, IsNull } from 'typeorm';
import { InjectDataSource, InjectEntityModel } from '@midwayjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BaseService } from '../../../common/base.service';
import { MenuEntity } from '../entity/menu';
import { R } from '../../../common/base.error.util';
import { MenuInterfaceEntity } from '../entity/menu.interface';
import { MenuDTO } from '../dto/menu';

@Provide()
export class MenuService extends BaseService<MenuEntity> {
  @InjectEntityModel(MenuEntity)
  menuModel: Repository<MenuEntity>;
  @InjectEntityModel(MenuInterfaceEntity)
  menuInterfaceModel: Repository<MenuInterfaceEntity>;
  @InjectDataSource()
  defaultDataSource: DataSource;

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

    return await this.create(data.toEntity());
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
    const menuInterfaces = await this.menuInterfaceModel.findBy({
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
