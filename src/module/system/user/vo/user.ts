import { ApiProperty, getSchemaPath } from '@midwayjs/swagger';
import { FileEntity } from '../../file/entity/file';
import { RoleVO } from '../../role/vo/role';

export class UserVO {
  @ApiProperty({ description: '用户ID' })
  id: string;

  @ApiProperty({ description: '用户名称' })
  userName: string;

  @ApiProperty({ description: '用户昵称' })
  nickName: string;

  @ApiProperty({ description: '手机号' })
  phoneNumber: string;

  @ApiProperty({ description: '邮箱' })
  email: string;

  @ApiProperty({ description: '头像地址' })
  avatarPath: string;

  @ApiProperty({ description: '头像', type: FileEntity })
  avatar?: FileEntity;

  @ApiProperty({
    description: '角色列表',
    type: 'array',
    items: { $ref: getSchemaPath(RoleVO) },
  })
  roles: RoleVO[];
}
