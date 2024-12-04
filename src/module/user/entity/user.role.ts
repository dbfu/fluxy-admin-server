import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../../../common/base.entity';

@Entity({ tableName: 'sys_user_role' })
export class UserRoleEntity extends BaseEntity {
  @Property({ comment: '用户id' })
  userId?: string;
  @Property({ comment: '角色id' })
  roleId?: string;
}
