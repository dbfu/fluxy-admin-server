import { Collection, Entity, ManyToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from '../../../common/base.entity';
import { RoleEntity } from '../../role/entity/role';
import { UserEntity } from '../../user/entity/user';

@Entity({ tableName: 'sys_menu' })
export class MenuEntity extends BaseEntity {
  @Property({ comment: '上级id', nullable: true })
  parentId?: string;
  @Property({ comment: '名称' })
  name?: string;
  @Property({ comment: '图标', nullable: true })
  icon?: string;
  @Property({ comment: '类型，1:目录 2:菜单 3:按钮 4:低代码页面' })
  type?: number;
  @Property({ comment: '路由', nullable: true })
  route?: string;
  @Property({ comment: '本地组件地址', nullable: true })
  filePath?: string;
  @Property({ comment: '排序号', nullable: true })
  orderNumber?: number;
  @Property({ comment: 'url', nullable: true })
  url?: string;
  @Property({ comment: '是否在菜单中显示' })
  show?: boolean;
  @Property({ comment: '按钮权限代码', nullable: true })
  authCode?: string;
  @Property({ comment: '低代码页面当前版本号', nullable: true })
  curVersion?: string;

  hasChild: boolean;

  @ManyToMany({ entity: () => RoleEntity })
  roles? = new Collection<UserEntity>(this);
}
