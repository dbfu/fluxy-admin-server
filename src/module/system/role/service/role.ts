import { CasbinEnforcerService } from '@midwayjs/casbin';
import { NodeRedisWatcher } from '@midwayjs/casbin-redis-adapter';
import { CasbinRule } from '@midwayjs/casbin-typeorm-adapter';
import { Inject, Provide } from '@midwayjs/decorator';
import { InjectDataSource, InjectEntityModel } from '@midwayjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { BaseService } from '../../../../common/base-service';
import { AssertUtils } from '../../../../utils/assert';
import { MenuApiEntity } from '../../menu/entity/menu-api';
import { SocketService } from '../../socket/service/socket';
import { SocketMessageType } from '../../socket/type';
import { UserRoleEntity } from '../../user/entity/user-role';
import { RoleDTO } from '../dto/role';
import { RoleEntity } from '../entity/role';
import { RoleMenuEntity } from '../entity/role-menu';

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
  @Inject()
  casbinEnforcerService: CasbinEnforcerService;
  @Inject()
  casbinWatcher: NodeRedisWatcher;

  getModel(): Repository<RoleEntity> {
    return this.roleModel;
  }

  /**
   * 创建角色
   * @param data
   */
  async createRole(data: RoleDTO): Promise<RoleEntity> {
    AssertUtils.isTrue(
      (await this.roleModel.countBy({ code: data.code })) === 0,
      '角色代码不能重复'
    );

    const result = await this.defaultDataSource.transaction(async manager => {
      const entity = data.toEntity();
      await manager.save(RoleEntity, entity);

      data.menuIds = data.menuIds || [];
      const roleMenus = data.menuIds.map(menuId => {
        const roleMenu = new RoleMenuEntity();
        roleMenu.menuId = menuId;
        roleMenu.roleId = entity.id;
        return roleMenu;
      });

      if (roleMenus.length) {
        // 批量插入
        await manager
          .createQueryBuilder()
          .insert()
          .into(RoleMenuEntity)
          .values(roleMenus)
          .execute();
      }

      const apis = await this.menuApiModel.findBy({ menuId: In(data.menuIds) });

      const casbinRules = apis.map(api => {
        const casbinRule = new CasbinRule();
        casbinRule.ptype = 'p';
        casbinRule.v0 = entity.id;
        casbinRule.v1 = api.path;
        casbinRule.v2 = api.method;
        casbinRule.v3 = api.menuId;
        return casbinRule;
      });

      await manager
        .createQueryBuilder()
        .insert()
        .into(CasbinRule)
        .values(casbinRules)
        .execute();

      return entity;
    });
    this.casbinWatcher.publishData();
    return result;
  }

  /**
   * 更新角色
   * @param data
   * @returns
   */
  async editRole(data: RoleDTO): Promise<RoleEntity> {
    const result = await this.defaultDataSource.transaction(async manager => {
      const entity = data.toEntity();
      await manager.save(RoleEntity, entity);
      if (Array.isArray(data.menuIds)) {
        const roleMenus = await this.roleMenuModel.findBy({ roleId: data.id });

        await manager.delete(RoleMenuEntity, roleMenus);

        if (data.menuIds.length) {
          // 批量插入
          await manager
            .createQueryBuilder()
            .insert()
            .into(RoleMenuEntity)
            .values(
              data.menuIds.map(menuId => {
                const roleMenu = new RoleMenuEntity();
                roleMenu.menuId = menuId;
                roleMenu.roleId = entity.id;
                return roleMenu;
              })
            )
            .execute();

          const oldMenuIds = roleMenus.map(menu => menu.menuId);
          if (oldMenuIds.length !== data.menuIds.length) {
            // 如果有变化，查询所有分配了该角色的用户，给对应所有用户发通知
            const userIds = (
              await this.userRoleModel.findBy({ roleId: data.id })
            ).map(userRole => userRole.userId);

            userIds.forEach(userId => {
              this.socketService.sendMessage(userId, {
                type: SocketMessageType.PermissionChange,
              });
            });
          }

          // 因为数组都是数字，所以先排序，排序之后把数组转换为字符串比较，写法比较简单
          const sortOldMenuIds = oldMenuIds.sort();
          const sortMenusIds = data.menuIds.sort();

          if (sortOldMenuIds.join() !== sortMenusIds.join()) {
            // 如果有变化，查询所有分配了该角色的用户，给对应所有用户发通知
            const userIds = (
              await this.userRoleModel.findBy({ roleId: data.id })
            ).map(userRole => userRole.userId);

            userIds.forEach(userId => {
              this.socketService.sendMessage(userId, {
                type: SocketMessageType.PermissionChange,
              });
            });
          }

          await this.casbinEnforcerService.deletePermissionsForUser(data.id);

          await manager
            .createQueryBuilder()
            .delete()
            .from(CasbinRule)
            .where({ ptype: 'p', v0: data.id })
            .execute();

          const apis = await this.menuApiModel.findBy({
            menuId: In(data.menuIds),
          });

          const casbinRules = apis.map(api => {
            const casbinRule = new CasbinRule();
            casbinRule.ptype = 'p';
            casbinRule.v0 = data.id;
            casbinRule.v1 = api.path;
            casbinRule.v2 = api.method;
            casbinRule.v3 = api.menuId;

            return casbinRule;
          });
          await manager
            .createQueryBuilder()
            .insert()
            .into(CasbinRule)
            .values(casbinRules)
            .execute();
        }
      }
      return entity;
    });
    this.casbinWatcher.publishData();

    return result;
  }

  /**
   * 删除角色
   * @param id
   */
  async removeRole(id: string) {
    await this.defaultDataSource.transaction(async manager => {
      await manager
        .createQueryBuilder()
        .delete()
        .from(RoleEntity)
        .where('id = :id', { id })
        .execute();
      await manager
        .createQueryBuilder()
        .delete()
        .from(RoleMenuEntity)
        .where('roleId = :id', { id })
        .execute();
      await manager
        .createQueryBuilder()
        .delete()
        .from(CasbinRule)
        .where({ ptype: 'p', v0: id })
        .execute();
    });

    await this.casbinWatcher.publishData();
  }

  async getMenusByRoleId(roleId: string) {
    const curRoleMenus = await this.roleMenuModel.find({
      where: { roleId: roleId },
    });
    return curRoleMenus;
  }

  /**
   * 为角色分配菜单
   * @param roleId
   * @param menuIds
   */
  async allocMenu(roleId: string, menuIds: string[]) {
    const curRoleMenus = await this.roleMenuModel.findBy({
      roleId,
    });

    const roleMenus = [];
    menuIds.forEach((menuId: string) => {
      const roleMenu = new RoleMenuEntity();
      roleMenu.menuId = menuId;
      roleMenu.roleId = roleId;
      roleMenus.push(roleMenu);
    });

    await this.defaultDataSource.transaction(async manager => {
      await manager.remove(RoleMenuEntity, curRoleMenus);
      await manager.save(RoleMenuEntity, roleMenus);

      await manager
        .createQueryBuilder()
        .delete()
        .from(CasbinRule)
        .where({ ptype: 'p', v0: roleId })
        .execute();

      const apis = await this.menuApiModel.findBy({
        menuId: In(menuIds),
      });

      const casbinRules = apis.map(api => {
        const casbinRule = new CasbinRule();
        casbinRule.ptype = 'p';
        casbinRule.v0 = roleId;
        casbinRule.v1 = api.path;
        casbinRule.v2 = api.method;
        casbinRule.v3 = api.menuId;

        return casbinRule;
      });
      await manager
        .createQueryBuilder()
        .insert()
        .into(CasbinRule)
        .values(casbinRules)
        .execute();

      const oldMenuIds = curRoleMenus.map(menu => menu.menuId);
      if (oldMenuIds.length !== menuIds.length) {
        // 如果有变化，查询所有分配了该角色的用户，给对应所有用户发通知
        const userIds = (await this.userRoleModel.findBy({ roleId })).map(
          userRole => userRole.userId
        );

        userIds.forEach(userId => {
          this.socketService.sendMessage(userId, {
            type: SocketMessageType.PermissionChange,
          });
        });
      }

      // 因为数组都是数字，所以先排序，排序之后把数组转换为字符串比较，写法比较简单
      const sortOldMenuIds = oldMenuIds.sort();
      const sortMenusIds = menuIds.sort();

      if (sortOldMenuIds.join() !== sortMenusIds.join()) {
        // 如果有变化，查询所有分配了该角色的用户，给对应所有用户发通知
        const userIds = (await this.userRoleModel.findBy({ roleId })).map(
          userRole => userRole.userId
        );

        userIds.forEach(userId => {
          this.socketService.sendMessage(userId, {
            type: SocketMessageType.PermissionChange,
          });
        });
      }
    });

    await this.casbinWatcher.publishData();
  }
}
