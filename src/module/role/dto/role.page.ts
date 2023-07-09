import { ApiProperty } from '@midwayjs/swagger';
import { Rule } from '@midwayjs/validate';
import { PageDTO } from '../../../common/page.dto';
import { string } from '../../../common/common.validate.rules';

export class RolePageDTO extends PageDTO {
  @ApiProperty()
  @Rule(string.allow(null, ''))
  code?: string;
  @ApiProperty()
  @Rule(string.allow(null, ''))
  name?: string;
}
