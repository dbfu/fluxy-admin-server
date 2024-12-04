import { CasbinEnforcerService } from '@midwayjs/casbin';
import { NodeRedisWatcher } from '@midwayjs/casbin-redis-adapter';
import { CasbinRule } from '@midwayjs/casbin-typeorm-adapter';
import { Inject, Provide } from '@midwayjs/decorator';
import { InjectDataSource, InjectEntityModel } from '@midwayjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { MinioClient } from '../../../autoload/minio';
import { BaseService } from '../../../common/base.service';
import { RoleMenuEntity } from '../../role/entity/role.menu';
import { MenuDTO } from '../dto/menu';
import { MenuVersionDTO } from '../dto/menu.version';
import { UpdateMenuVersionDTO } from '../dto/update.menu.version';
import { MenuEntity } from '../entity/menu';
import { MenuApiEntity } from '../entity/menu.api';
import { MenuVersionEntity } from '../entity/menu.version';
import { EntityRepository, FilterQuery } from '@mikro-orm/mysql';
import { PageDTO } from '../../../common/page.dto';
import { AssertUtils } from '../../../utils/assert';

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
  @InjectDataSource()
  defaultDataSource: DataSource;
  @InjectEntityModel(CasbinRule)
  casbinModel: Repository<CasbinRule>;
  @Inject()
  casbinEnforcerService: CasbinEnforcerService;
  @Inject()
  casbinWatcher: NodeRedisWatcher;
  @Inject()
  minioClient: MinioClient;

  getModel(): EntityRepository<MenuEntity> {
    return this.getRepository(MenuEntity);
  }

  async createMenu(data: MenuDTO) {
    AssertUtils.isTrue(!data.route || (await this.repo(MenuEntity).count({ route: data.route })) === 0, '路由不能重复');
    AssertUtils.isTrue(!data.authCode || (await this.repo(MenuEntity).count({ authCode: data.authCode })) === 0, '权限代码不能重复');

    const menuEntity = this.repo(MenuEntity).create(data);
    const versionEntity = this.repo(MenuVersionEntity).create({});

    return await this.em.transactional(async (em) => {
      // 如果菜单类型为低代码页面，默认版本为v1.0.0
      if (menuEntity.type === MenuType.LowCodePage) {
        menuEntity.curVersion = 'v1.0.0';
      }

      await em.persistAndFlush(menuEntity);

      // 把低代码页面配置信息保存成json文件上传到minio文件服务器
      if (menuEntity.type === MenuType.LowCodePage && data.pageSetting) {
        // 初始化版本
        versionEntity.menuId = menuEntity.id;
        versionEntity.version = menuEntity.curVersion;
        versionEntity.description = '初始化';

        em.persist(versionEntity);

        await this.minioClient.putObject(
          'low-code',
          `${menuEntity.id}/${menuEntity.curVersion}.json`,
          Buffer.from(data.pageSetting, 'utf-8')
        );
      }

      (data.apis || []).forEach(api => {
        const menuApi = new MenuApiEntity();
        menuApi.menuId = menuEntity.id;
        menuApi.path = api.path;
        menuApi.method = api.method;
        em.persist(menuApi);
      });
      
      try {
        await em.flush();
      } catch {
        AssertUtils.isTrue(false, '创建失败');
      }


      return { ...menuEntity, version: versionEntity };
    })





    // await this.defaultDataSource.transaction(async manager => {
    //   // 如果菜单类型为低代码页面，默认版本为v1.0.0
    //   if (entity.type === MenuType.LowCodePage) {
    //     entity.curVersion = 'v1.0.0';
    //   }

    //   await manager.save(MenuEntity, entity);

    //   // 把低代码页面配置信息保存成json文件上传到minio文件服务器
    //   if (entity.type === MenuType.LowCodePage && data.pageSetting) {
    //     // 初始化版本
    //     version.menuId = entity.id;
    //     version.version = entity.curVersion;
    //     version.description = '初始化';

    //     await manager.save(MenuVersionEntity, version);

    //     await this.minioClient.putObject(
    //       'low-code',
    //       `${entity.id}/${entity.curVersion}.json`,
    //       Buffer.from(data.pageSetting, 'utf-8')
    //     );
    //   }

    //   const menuApis = (data.apis || []).map(api => {
    //     const menuApi = new MenuApiEntity();
    //     menuApi.menuId = entity.id;
    //     menuApi.path = api.path;
    //     menuApi.method = api.method;
    //     return menuApi;
    //   });

    //   await manager.createQueryBuilder().insert().values(menuApis).execute();
    // });

    // return { ...entity, version };
  }

  async editMenu(data: MenuDTO) {
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

      await Promise.all(casbinRules);
    });

    await this.casbinWatcher.publishData();

    return entity;
  }

  async getMenusByPage(pageInfo: PageDTO, where: FilterQuery<MenuEntity>) {
    const [data, total] = await this.repo(MenuEntity).findAndCount(where, {
      limit: pageInfo.size,
      offset: pageInfo.page * pageInfo.size,
      orderBy: { orderNumber: 'ASC' },
    });

    // const order: FindOptionsOrder<MenuEntity> = { orderNumber: 'ASC' };

    // const [data, total] = await this.menuModel.findAndCount({
    //   where,
    //   order,
    //   skip: page * pageSize,
    //   take: pageSize,
    // });

    // if (!data.length) return { data: [], total: 0 };

    const ids = data.map((o: MenuEntity) => o.id);
    const menus = await this.repo(MenuEntity).findAll({
      where: { parentId: { $in: ids } },
    });

    const result = data.map(m => ({
      ...m.toObject(),
      hasChild: menus.filter(m2 => m2.parentId === m.id).length > 0,
    }))

    return { data: result, total };
  }

  async getChildren(parentId?: string) {
    AssertUtils.notEmpty(parentId, '父节点id不能为空');

    const data = await this.repo(MenuEntity).findAll({
      where: { parentId },
      orderBy: { orderNumber: 'ASC' },
    });
    if (!data.length) return [];

    const ids = data.map((o: MenuEntity) => o.id);
    const menus = await this.repo(MenuEntity).findAll({
      where: { parentId: { $in: ids } },
    });

    const result = data.map(m => ({
      ...m.toObject(),
      hasChild: menus.filter(m2 => m2.parentId === m.id).length > 0,
    }))

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
