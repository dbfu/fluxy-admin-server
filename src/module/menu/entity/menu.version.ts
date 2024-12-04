import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../../../common/base.entity';

@Entity({ tableName: 'sys_menu_version' })
export class MenuVersionEntity extends BaseEntity {
  @Property({ comment: '菜单id' })
  menuId?: string;
  @Property({ comment: '版本号' })
  version?: string;
  @Property({ comment: '版本描述' })
  description?: string;
}
