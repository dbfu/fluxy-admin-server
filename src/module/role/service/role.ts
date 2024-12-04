import { Inject, Provide } from '@midwayjs/decorator';
import { InjectDataSource, InjectEntityModel } from '@midwayjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BaseService } from '../../../common/base.service';
import { MenuApiEntity } from '../../menu/entity/menu.api';
import { RoleEntity } from '../entity/role';
import { RoleMenuEntity } from '../entity/role.menu';

import { RoleDTO } from '../dto/role';
// import { R } from '../../../common/base.error.util';
import { SocketService } from '../../../socket/service';
import { UserRoleEntity } from '../../user/entity/user.role';
import { EntityRepository, FilterQuery } from '@mikro-orm/mysql';
import { PageDTO } from '../../../common/page.dto';
import { AssertUtils } from '../../../utils/assert';
import { MenuEntity } from '../../menu/entity/menu';
// import { SocketMessageType } from '../../../socket/message';
// import { CasbinEnforcerService } from '@midwayjs/casbin';
// import { CasbinRule } from '@midwayjs/casbin-typeorm-adapter';
// import { NodeRedisWatcher } from '@midwayjs/casbin-redis-adapter';

@Provide()
export class RoleService extends BaseService<RoleEntity> {
  @InjectEntityModel(RoleEntity)
  roleModel: Repository<RoleEntity>;
  @InjectEntityModel(RoleMenuEntity)
  roleMenuModel: Repository<RoleMenuEntity>;
  @InjectEntityModel(MenuApiEntity)
  menuApiModel: Repository<MenuApiEntity>;
  @InjectEntityModel(UserRoleEntity)
  userRoleModel: Repository<UserRoleEntity>;
  @InjectDataSource()
  defaultDataSource: DataSource;
  @Inject()
  socketService: SocketService;
  // @Inject()
  // casbinEnforcerService: CasbinEnforcerService;
  // @Inject()
  // casbinWatcher: NodeRedisWatcher;

  getModel(): EntityRepository<RoleEntity> {
    if (!this.curModel) {
      this.curModel = this.getRepository(RoleEntity);
    }
    return this.curModel;
  }

  async createRole(data: RoleDTO) {
    AssertUtils.isTrue(
      (await this.repo(RoleEntity).count({ code: data.code })) === 0,
      '代码不能重复'
    );

    await this.em.transactional(async () => {
      const entity = this.em.create(RoleEntity, data);

      data.menuIds.forEach(menuId => {
        entity.menus.add(this.em.getReference(MenuEntity, menuId));
      });

      this.repo(RoleEntity).create(entity);

      await this.em.flush();
    });

    // if ((await this.roleModel.countBy({ code: data.code })) > 0) {
    //   throw R.error('代码不能重复');
    // }
    // await this.defaultDataSource.transaction(async manager => {
    //   const entity = data.toEntity();
    //   await manager.save(RoleEntity, entity);
    //   data.menuIds = data.menuIds || [];
    //   const roleMenus = data.menuIds.map(menuId => {
    //     const roleMenu = new RoleMenuEntity();
    //     roleMenu.menuId = menuId;
    //     roleMenu.roleId = entity.id;
    //     return roleMenu;
    //   });
    //   if (roleMenus.length) {
    //     // 批量插入
    //     await manager
    //       .createQueryBuilder()
    //       .insert()
    //       .into(RoleMenuEntity)
    //       .values(roleMenus)
    //       .execute();
    //   }
    //   const apis = await this.menuApiModel.findBy({ menuId: In(data.menuIds) });
    //   const casbinRules = apis.map(api => {
    //     const casbinRule = new CasbinRule();
    //     casbinRule.ptype = 'p';
    //     casbinRule.v0 = entity.id;
    //     casbinRule.v1 = api.path;
    //     casbinRule.v2 = api.method;
    //     casbinRule.v3 = api.menuId;
    //     return casbinRule;
    //   });
    //   await manager
    //     .createQueryBuilder()
    //     .insert()
    //     .into(CasbinRule)
    //     .values(casbinRules)
    //     .execute();
    // });
    // this.casbinWatcher.publishData();
  }

  async updateRole(data: RoleDTO) {
    // await this.defaultDataSource.transaction(async manager => {
    //   const entity = data.toEntity();
    //   await manager.save(RoleEntity, entity);
    //   if (Array.isArray(data.menuIds)) {
    //     const roleMenus = await this.roleMenuModel.findBy({ roleId: data.id });
    //     await manager.delete(RoleMenuEntity, roleMenus);
    //     if (data.menuIds.length) {
    //       // 批量插入
    //       await manager
    //         .createQueryBuilder()
    //         .insert()
    //         .into(RoleMenuEntity)
    //         .values(
    //           data.menuIds.map(menuId => {
    //             const roleMenu = new RoleMenuEntity();
    //             roleMenu.menuId = menuId;
    //             roleMenu.roleId = entity.id;
    //             return roleMenu;
    //           })
    //         )
    //         .execute();
    //       const oldMenuIds = roleMenus.map(menu => menu.menuId);
    //       if (oldMenuIds.length !== data.menuIds.length) {
    //         // 如果有变化，查询所有分配了该角色的用户，给对应所有用户发通知
    //         const userIds = (
    //           await this.userRoleModel.findBy({ roleId: data.id })
    //         ).map(userRole => userRole.userId);
    //         userIds.forEach(userId => {
    //           this.socketService.sendMessage(userId, {
    //             type: SocketMessageType.PermissionChange,
    //           });
    //         });
    //       }
    //       // 因为数组都是数字，所以先排序，排序之后把数组转换为字符串比较，写法比较简单
    //       const sortOldMenuIds = oldMenuIds.sort();
    //       const sortMenusIds = data.menuIds.sort();
    //       if (sortOldMenuIds.join() !== sortMenusIds.join()) {
    //         // 如果有变化，查询所有分配了该角色的用户，给对应所有用户发通知
    //         const userIds = (
    //           await this.userRoleModel.findBy({ roleId: data.id })
    //         ).map(userRole => userRole.userId);
    //         userIds.forEach(userId => {
    //           this.socketService.sendMessage(userId, {
    //             type: SocketMessageType.PermissionChange,
    //           });
    //         });
    //       }
    //       // await this.casbinEnforcerService.deletePermissionsForUser(data.id);
    //       await manager
    //         .createQueryBuilder()
    //         .delete()
    //         .from(CasbinRule)
    //         .where({ ptype: 'p', v0: data.id })
    //         .execute();
    //       const apis = await this.menuApiModel.findBy({
    //         menuId: In(data.menuIds),
    //       });
    //       const casbinRules = apis.map(api => {
    //         const casbinRule = new CasbinRule();
    //         casbinRule.ptype = 'p';
    //         casbinRule.v0 = data.id;
    //         casbinRule.v1 = api.path;
    //         casbinRule.v2 = api.method;
    //         casbinRule.v3 = api.menuId;
    //         return casbinRule;
    //       });
    //       await manager
    //         .createQueryBuilder()
    //         .insert()
    //         .into(CasbinRule)
    //         .values(casbinRules)
    //         .execute();
    //     }
    //   }
    // });
    // this.casbinWatcher.publishData();
  }

  async removeRole(id: string) {
    // await this.defaultDataSource.transaction(async manager => {
    //   await manager
    //     .createQueryBuilder()
    //     .delete()
    //     .from(RoleEntity)
    //     .where('id = :id', { id })
    //     .execute();
    //   await manager
    //     .createQueryBuilder()
    //     .delete()
    //     .from(RoleMenuEntity)
    //     .where('roleId = :id', { id })
    //     .execute();
    //   await manager
    //     .createQueryBuilder()
    //     .delete()
    //     .from(CasbinRule)
    //     .where({ ptype: 'p', v0: id })
    //     .execute();
    // });
    // await this.casbinWatcher.publishData();
  }

  async getRolesByPage(pageInfo: PageDTO, where: FilterQuery<RoleEntity>) {
    const [data, total] = await this.repo(RoleEntity).findAndCount(where, {
      orderBy: {
        createDate: 'DESC',
      },
      limit: pageInfo.size,
      offset: pageInfo.page * pageInfo.size,
      populate: ['users', 'menus'],
    });

    return {
      data: data.map(entity => entity.toVO()),
      total,
    };
  }

  async getMenusByRoleId(roleId: string) {
    const curRoleMenus = await this.roleMenuModel.find({
      where: { roleId: roleId },
    });
    return curRoleMenus;
  }

  async allocMenu(roleId: string, menuIds: string[]) {
    // const curRoleMenus = await this.roleMenuModel.findBy({
    //   roleId,
    // });
    // const roleMenus = [];
    // menuIds.forEach((menuId: string) => {
    //   const roleMenu = new RoleMenuEntity();
    //   roleMenu.menuId = menuId;
    //   roleMenu.roleId = roleId;
    //   roleMenus.push(roleMenu);
    // });
    // await this.defaultDataSource.transaction(async manager => {
    //   await manager.remove(RoleMenuEntity, curRoleMenus);
    //   await manager.save(RoleMenuEntity, roleMenus);
    //   await manager
    //     .createQueryBuilder()
    //     .delete()
    //     .from(CasbinRule)
    //     .where({ ptype: 'p', v0: roleId })
    //     .execute();
    //   const apis = await this.menuApiModel.findBy({
    //     menuId: In(menuIds),
    //   });
    //   const casbinRules = apis.map(api => {
    //     const casbinRule = new CasbinRule();
    //     casbinRule.ptype = 'p';
    //     casbinRule.v0 = roleId;
    //     casbinRule.v1 = api.path;
    //     casbinRule.v2 = api.method;
    //     casbinRule.v3 = api.menuId;
    //     return casbinRule;
    //   });
    //   await manager
    //     .createQueryBuilder()
    //     .insert()
    //     .into(CasbinRule)
    //     .values(casbinRules)
    //     .execute();
    //   const oldMenuIds = curRoleMenus.map(menu => menu.menuId);
    //   if (oldMenuIds.length !== menuIds.length) {
    //     // 如果有变化，查询所有分配了该角色的用户，给对应所有用户发通知
    //     const userIds = (await this.userRoleModel.findBy({ roleId })).map(
    //       userRole => userRole.userId
    //     );
    //     userIds.forEach(userId => {
    //       this.socketService.sendMessage(userId, {
    //         type: SocketMessageType.PermissionChange,
    //       });
    //     });
    //   }
    //   // 因为数组都是数字，所以先排序，排序之后把数组转换为字符串比较，写法比较简单
    //   const sortOldMenuIds = oldMenuIds.sort();
    //   const sortMenusIds = menuIds.sort();
    //   if (sortOldMenuIds.join() !== sortMenusIds.join()) {
    //     // 如果有变化，查询所有分配了该角色的用户，给对应所有用户发通知
    //     const userIds = (await this.userRoleModel.findBy({ roleId })).map(
    //       userRole => userRole.userId
    //     );
    //     userIds.forEach(userId => {
    //       this.socketService.sendMessage(userId, {
    //         type: SocketMessageType.PermissionChange,
    //       });
    //     });
    //   }
    // });
    // await this.casbinWatcher.publishData();
  }
}
