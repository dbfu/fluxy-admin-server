import { Rule } from '@midwayjs/validate';
import { R } from '../../../common/base.error.util';
import { requiredString } from '../../../common/common.validate.rules';

export class UpdateMenuVersionDTO {
  @Rule(requiredString.error(R.validateError('id不能为空')))
  id: string;
  @Rule(requiredString.error(R.validateError('低代码配置不能为空')))
  pageSetting: string;
}
