import { Rule, RuleType } from '@midwayjs/validate';
import { RoleEntity } from '../entity/role';
import { R } from '../../../common/base.error.util';
import { requiredString } from '../../../common/common.validate.rules';
import { BaseDTO } from '../../../common/base.dto';

export class RoleDTO extends BaseDTO<RoleEntity> {
  @Rule(requiredString.error(R.validateError('代码不能为空')))
  code?: string;
  @Rule(requiredString.error(R.validateError('名称不能为空')))
  name?: string;
  @Rule(RuleType.array<string>())
  menuIds?: string[];
}
