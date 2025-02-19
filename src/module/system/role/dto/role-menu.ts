import { ApiProperty } from '@midwayjs/swagger';
import { Rule, RuleType } from '@midwayjs/validate';
import { R } from '../../../../common/base-error-util';
import { requiredString } from '../../../../common/common-validate-rules';

export class RoleMenuDTO {
  @ApiProperty({ description: '角色id' })
  @Rule(requiredString.error(R.validateError('角色id不能为空')))
  roleId?: string;

  @ApiProperty({
    description: '菜单id列表',
    type: 'array',
    items: { type: 'string' },
  })
  @Rule(RuleType.array().items(RuleType.string()))
  menuIds?: string[];
}
