import { Provide } from '@midwayjs/decorator';
import { InjectDataSource, InjectEntityModel } from '@midwayjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BaseService } from '../../../common/base.service';
import { MenuInterfaceEntity } from '../../menu/entity/menu.interface';
import { RolePageDTO } from '../dto/role.page';
import { RoleEntity } from '../entity/role';
import { RoleMenuEntity } from '../entity/role.menu';
import {
  createQueryBuilder,
  likeQueryByQueryBuilder,
} from '../../../utils/typeorm.utils';
import { RoleDTO } from '../dto/role';
import { R } from '../../../common/base.error.util';

@Provide()
export class RoleService extends BaseService<RoleEntity> {
  @InjectEntityModel(RoleEntity)
  roleModel: Repository<RoleEntity>;
  @InjectEntityModel(RoleMenuEntity)
  roleMenuModel: Repository<RoleMenuEntity>;
  @InjectEntityModel(MenuInterfaceEntity)
  menuInterfaceModel: Repository<MenuInterfaceEntity>;
  @InjectDataSource()
  defaultDataSource: DataSource;

  getModel(): Repository<RoleEntity> {
    return this.roleModel;
  }

  async createRole(data: RoleDTO) {
    if ((await this.roleModel.countBy({ code: data.code })) > 0) {
      throw R.error('代码不能重复');
    }
    this.defaultDataSource.transaction(async manager => {
      const entity = data.toEntity();
      await manager.save(RoleEntity, entity);
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
    });
  }

  async editRole(data: RoleDTO) {
    await this.defaultDataSource.transaction(async manager => {
      const entity = data.toEntity();
      await manager.save(RoleEntity, entity);
      if (Array.isArray(data.menuIds)) {
        await manager
          .createQueryBuilder()
          .delete()
          .from(RoleMenuEntity)
          .where('roleId = :roleId', { roleId: data.id })
          .execute();

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
      }
    });
  }

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
    });
  }

  async getRoleListByPage(rolePageDTO: RolePageDTO) {
    const { name, code, page, size } = rolePageDTO;
    let queryBuilder = createQueryBuilder<RoleEntity>(this.roleModel);
    queryBuilder = likeQueryByQueryBuilder(queryBuilder, {
      code,
      name,
    });

    const [data, total] = await queryBuilder
      .orderBy('createDate', 'DESC')
      .skip(page * size)
      .take(size)
      .getManyAndCount();

    return {
      total,
      data,
    };
  }

  async getMenusByRoleId(roleId: string) {
    const curRoleMenus = await this.roleMenuModel.find({
      where: { roleId: roleId },
    });
    return curRoleMenus;
  }

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

    await this.defaultDataSource.transaction(async transaction => {
      await Promise.all([transaction.remove(RoleMenuEntity, curRoleMenus)]);
      await Promise.all([transaction.save(RoleMenuEntity, roleMenus)]);
    });
  }
}
