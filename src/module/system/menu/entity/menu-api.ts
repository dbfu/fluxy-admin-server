import { ApiProperty } from '@midwayjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../../common/base-entity';

@Entity('sys_menu_api')
export class MenuApiEntity extends BaseEntity {
  @ApiProperty({ description: '菜单id' })
  @Column({ comment: '菜单id' })
  menuId?: string;

  @ApiProperty({ description: '请求方式' })
  @Column({ comment: '请求方式' })
  method?: string;

  @ApiProperty({ description: '请求url' })
  @Column({ comment: 'path' })
  path?: string;
}
