import { ApiProperty } from '@midwayjs/swagger';
import { Rule } from '@midwayjs/validate';
import { R } from '../../../../common/base-error-util';
import { requiredString } from '../../../../common/common-validate-rules';

export class ApiDTO {
  @ApiProperty({ description: '接口url' })
  @Rule(requiredString.error(R.validateError('path不能为空')))
  path: string;

  @ApiProperty({ description: '接口请求方式' })
  @Rule(requiredString.error(R.validateError('method不能为空')))
  method: string;
}
