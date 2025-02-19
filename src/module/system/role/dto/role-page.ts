import { ApiProperty } from '@midwayjs/swagger';
import { Rule } from '@midwayjs/validate';
import { string } from '../../../../common/common-validate-rules';
import { PageDTO } from '../../../../common/page-dto';

export class RolePageDTO extends PageDTO {
  @ApiProperty({ description: '角色编码' })
  @Rule(string.allow(null, ''))
  code?: string;

  @ApiProperty({ description: '角色名称' })
  @Rule(string.allow(null, ''))
  name?: string;
}
