import { ApiProperty } from '@midwayjs/swagger';
import { MenuVO } from '../../menu/vo/menu';
import { UserVO } from '../../user/vo/user';

export class CurrentUserVO extends UserVO {
  @ApiProperty({
    description: '用户分配的菜单列表',
    type: MenuVO,
    isArray: true,
  })
  menus: MenuVO[];
}
