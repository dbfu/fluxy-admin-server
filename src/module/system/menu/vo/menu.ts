import { ApiProperty } from '@midwayjs/swagger';
import { MenuEntity } from '../entity/menu';

export class MenuVO extends MenuEntity {
  @ApiProperty({ description: '子菜单' })
  hasChild?: boolean;
}
