import { ApiProperty } from '@midwayjs/swagger';
import { Rule } from '@midwayjs/validate';
import { string } from '../../../../common/common-validate-rules';
import { PageDTO } from '../../../../common/page-dto';

export class LoginLogPageDTO extends PageDTO {
  @ApiProperty({ description: '用户名' })
  @Rule(string.allow(null, ''))
  userName?: string;
}
