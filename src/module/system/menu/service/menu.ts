import { CasbinEnforcerService } from '@midwayjs/casbin';
import { NodeRedisWatcher } from '@midwayjs/casbin-redis-adapter';
import { CasbinRule } from '@midwayjs/casbin-typeorm-adapter';
import { Inject, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { MinioClient } from '../../../../autoload/minio';
import { BaseService } from '../../../../common/base-service';
import { PageDTO } from '../../../../common/page-dto';
import { AssertUtils } from '../../../../utils/assert';
import { RoleMenuEntity } from '../../role/entity/role-menu';
import { MenuDTO } from '../dto/menu';
import { MenuVersionDTO } from '../dto/menu-version';
import { UpdateMenuVersionDTO } from '../dto/update-menu-version';
import { MenuEntity } from '../entity/menu';
import { MenuApiEntity } from '../entity/menu-api';
import { MenuVersionEntity } from '../entity/menu-version';
import { MenuVO } from '../vo/menu';
import { MenuPageVO } from '../vo/menu-page';

enum MenuType {
  DIRECTORY = 1,
  MENU,
  BUTTON,
  LowCodePage,
}

@Provide()
export class MenuService extends BaseService<MenuEntity> {
  @InjectEntityModel(MenuEntity)
  menuModel: Repository<MenuEntity>;
  @InjectEntityModel(MenuApiEntity)
  menuApiModel: Repository<MenuApiEntity>;
  @InjectEntityModel(RoleMenuEntity)
  roleMenuModel: Repository<RoleMenuEntity>;
  @InjectEntityModel(MenuVersionEntity)
  menuVersionModel: Repository<MenuVersionEntity>;
  @InjectEntityModel(CasbinRule)
  casbinModel: Repository<CasbinRule>;
  @Inject()
  casbinEnforcerService: CasbinEnforcerService;
  @Inject()
  casbinWatcher: NodeRedisWatcher;
  @Inject()
  minioClient: MinioClient;

  getModel(): Repository<MenuEntity> {
    return this.menuModel;
  }

  /**
   * 分页查询菜单
   */
  async getMenusByPage(pageInfo: PageDTO): Promise<MenuPageVO> {
    const { data, total } = await this.page(pageInfo, {
      where: { parentId: IsNull() },
      order: { orderNumber: 'ASC' },
    });

    if (!data.length) return { data: [], total: 0 };

    const ids = data.map(o => o.id);
    const countMap = await this.menuModel
      .createQueryBuilder('menu')
      .select('COUNT(menu.parentId)', 'count')
      .addSelect('menu.parentId', 'id')
      .where('menu.parentId IN (:...ids)', { ids })
      .groupBy('menu.parentId')
      .getRawMany();

    const result = data.map(item => {
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

  /**
   * 获取菜单子节点
   */
  async getChildren(parentId?: string): Promise<MenuVO[]> {
    AssertUtils.notEmpty(parentId, '父节点id不能为空');

    const data = await this.menuModel.find({
      where: { parentId },
      order: { orderNumber: 'ASC' },
    });

    if (!data.length) return [];

    const ids = data.map(o => o.id);
    const countMap = await this.menuModel
      .createQueryBuilder('menu')
      .select('COUNT(menu.parentId)', 'count')
      .addSelect('menu.parentId', 'id')
      .where('menu.parentId IN (:...ids)', { ids })
      .groupBy('menu.parentId')
      .getRawMany();

    const result = data.map(item => {
      const count = countMap.find(o => o.id === item.id)?.count || 0;
      return {
        ...item,
        hasChild: Number(count) > 0,
      };
    });

    return result;
  }

  /**
   * 创建菜单
   */
  async createMenu(data: MenuDTO) {
    AssertUtils.isTrue(
      !data.route ||
        (await this.menuModel.countBy({ route: data.route })) === 0,
      '路由不能重复'
    );

    AssertUtils.isTrue(
      !data.authCode ||
        (await this.menuModel.countBy({ authCode: data.authCode })) === 0,
      '权限代码不能重复'
    );

    const entity = data.toEntity();
    const version = new MenuVersionEntity();

    await this.defaultDataSource.transaction(async manager => {
      // 如果菜单类型为低代码页面，默认版本为v1.0.0
      if (entity.type === MenuType.LowCodePage) {
        entity.curVersion = 'v1.0.0';
      }

      await manager.save(MenuEntity, entity);

      // 把低代码页面配置信息保存成json文件上传到minio文件服务器
      if (entity.type === MenuType.LowCodePage && data.pageSetting) {
        // 初始化版本
        version.menuId = entity.id;
        version.version = entity.curVersion;
        version.description = '初始化';

        await manager.save(MenuVersionEntity, version);

        await this.minioClient.putObject(
          'low-code',
          `${entity.id}/${entity.curVersion}.json`,
          Buffer.from(data.pageSetting, 'utf-8')
        );
      }

      const menuApis = (data.apis || []).map(api => {
        const menuApi = new MenuApiEntity();
        menuApi.menuId = entity.id;
        menuApi.path = api.path;
        menuApi.method = api.method;
        return menuApi;
      });

      await manager.save(MenuApiEntity, menuApis);
    });
  }

  /**
   * 更新菜单
   */
  async updateMenu(data: MenuDTO) {
    const entity = data.toEntity();

    await this.defaultDataSource.transaction(async manager => {
      await manager
        .createQueryBuilder()
        .delete()
        .from(MenuApiEntity)
        .where({ menuId: entity.id })
        .execute();

      await manager.save(MenuEntity, entity);

      const roleMenus = await this.roleMenuModel.findBy({ menuId: entity.id });

      await manager
        .createQueryBuilder()
        .delete()
        .from(CasbinRule)
        .where({ v3: entity.id })
        .execute();

      const menuApis = data.apis.map(api => {
        const menuApi = new MenuApiEntity();
        menuApi.menuId = entity.id;
        menuApi.path = api.path;
        menuApi.method = api.method;
        return menuApi;
      });

      await manager
        .createQueryBuilder()
        .insert()
        .into(MenuApiEntity)
        .values(menuApis)
        .execute();

      const casbinRules = roleMenus.reduce((prev, cur) => {
        prev.push(
          ...data.apis.map(api => {
            const casbinRule = new CasbinRule();
            casbinRule.ptype = 'p';
            casbinRule.v0 = cur.roleId;
            casbinRule.v1 = api.path;
            casbinRule.v2 = api.method;
            casbinRule.v3 = cur.menuId;
            return casbinRule;
          })
        );
        return prev;
      }, []);

      await manager.save(CasbinRule, casbinRules);
    });

    await this.casbinWatcher.publishData();
  }

  /**
   * 删除菜单
   */
  async removeMenu(id: string) {
    await this.menuModel
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .orWhere('parentId = :id', { id })
      .execute();
  }

  /**
   * 获取菜单已分配的接口
   */
  async getAllocAPIByMenu(menuId: string): Promise<MenuApiEntity[]> {
    const menuAPIs = await this.menuApiModel.findBy({
      menuId,
    });
    return menuAPIs;
  }

  // 分页查询低代码页面和版本
  async queryLowCodeMenus(page = 0, size = 10) {
    const [data, total] = await this.menuModel
      .createQueryBuilder('menu')
      .leftJoinAndMapMany(
        'menu.versions',
        MenuVersionEntity,
        'version',
        'menu.id = version.menuId'
      )
      .where('menu.type = :type', { type: MenuType.LowCodePage })
      .orderBy('menu.createDate', 'DESC')
      .skip(page * size)
      .take(size)
      .getManyAndCount();

    return {
      data,
      total,
    };
  }

  async queryVersionById(versionId: string) {
    const version = await this.menuVersionModel
      .createQueryBuilder('t')
      .leftJoinAndMapOne('t.menu', MenuEntity, 'm', 't.menuId = m.id')
      .where('t.id = :versionId', { versionId })
      .getOne();
    return version;
  }

  // 更新版本配置
  async updateVersion(data: UpdateMenuVersionDTO) {
    const version = await this.menuVersionModel.findOneBy({ id: data.id });

    // 更新时间
    version.updateDate = new Date();

    await this.menuVersionModel.save(version);

    await this.minioClient.putObject(
      'low-code',
      `${version.menuId}/${version.version}.json`,
      Buffer.from(data.pageSetting, 'utf-8')
    );
  }

  async getLatestVersionByMenuId(menuId: string) {
    const version = await this.menuVersionModel
      .createQueryBuilder('t')
      .where('t.menuId = :menuId', { menuId })
      .orderBy('t.id', 'DESC')
      .getOne();
    return version;
  }

  // 创建新版本
  async createNewVersion(data: MenuVersionDTO) {
    const entity = data.toEntity();
    await this.defaultDataSource.transaction(async manager => {
      await manager.save(MenuVersionEntity, entity);

      await this.minioClient.putObject(
        'low-code',
        `${entity.menuId}/${entity.version}.json`,
        Buffer.from(data.pageSetting, 'utf-8')
      );
    });

    return entity;
  }

  // 发布版本
  async publishLowCodePage(menuId: string, version: string) {
    const menu = await this.menuModel.findOneBy({ id: menuId });
    menu.curVersion = version;
    await this.menuModel.save(menu);
  }
}
