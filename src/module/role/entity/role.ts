import { Collection, Entity, ManyToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from '../../../common/base.entity';
import { UserEntity } from '../../user/entity/user';
import { MenuEntity } from '../../menu/entity/menu';

@Entity({ tableName: 'sys_role' })
export class RoleEntity extends BaseEntity {
  @Property({ comment: '名称' })
  name?: string;
  @Property({ comment: '代码' })
  code?: string;
  @ManyToMany({ entity: () => UserEntity })
  users? = new Collection<UserEntity>(this);
  @ManyToMany({ entity: () => MenuEntity, mappedBy: 'roles' })
  menus? = new Collection<MenuEntity>(this);
}
