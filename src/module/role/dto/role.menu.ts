import { Rule, RuleType } from '@midwayjs/validate';
import { R } from '../../../common/base.error.util';
import { requiredString } from '../../../common/common.validate.rules';

export class RoleMenuDTO {
  @Rule(requiredString.error(R.validateError('角色id不能为空')))
  roleId?: string;
  @Rule(RuleType.array().items(RuleType.string()))
  menuIds?: string[];
}
