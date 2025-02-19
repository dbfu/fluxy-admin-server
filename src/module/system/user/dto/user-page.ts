import { ApiProperty } from '@midwayjs/swagger';
import { PageDTO } from '../../../../common/page-dto';

export class UserPageDTO extends PageDTO {
  @ApiProperty({ description: '用户名称' })
  userName: string;

  @ApiProperty({ description: '用户昵称' })
  nickName: string;

  @ApiProperty({ description: '手机号' })
  phoneNumber: string;

  @ApiProperty({ description: '邮箱' })
  email: string;
}
