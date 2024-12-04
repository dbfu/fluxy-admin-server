import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../../../common/base.entity';

@Entity({ tableName: 'sys_role_menu' })
export class RoleMenuEntity extends BaseEntity {
  @Property({ comment: '角色id' })
  roleId?: string;
  @Property({ comment: '菜单id' })
  menuId?: string;
}
