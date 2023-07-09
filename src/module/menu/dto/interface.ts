import { Rule } from '@midwayjs/validate';
import { R } from '../../../common/base.error.util';
import { requiredString } from '../../../common/common.validate.rules';

export class InterfaceDTO {
  @Rule(requiredString.error(R.validateError('path不能为空')))
  path: string;
  @Rule(requiredString.error(R.validateError('method不能为空')))
  method: string;
}
