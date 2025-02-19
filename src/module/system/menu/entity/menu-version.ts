import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../../common/base-entity';

@Entity('sys_menu_version')
export class MenuVersionEntity extends BaseEntity {
  @Column({ comment: '菜单id' })
  menuId?: string;
  @Column({ comment: '版本号' })
  version?: string;
  @Column({ comment: '版本描述' })
  description?: string;
}
