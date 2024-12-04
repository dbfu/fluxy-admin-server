import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../../../common/base.entity';

@Entity({ tableName: 'sys_menu_api' })
export class MenuApiEntity extends BaseEntity {
  @Property({ comment: '菜单id' })
  menuId?: string;
  @Property({ comment: '请求方式' })
  method?: string;
  @Property({ comment: 'path' })
  path?: string;
}
