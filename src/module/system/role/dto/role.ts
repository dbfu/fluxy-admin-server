import { ApiProperty } from '@midwayjs/swagger';
import { Rule, RuleType } from '@midwayjs/validate';
import { BaseDTO } from '../../../../common/base-dto';
import { R } from '../../../../common/base-error-util';
import { requiredString } from '../../../../common/common-validate-rules';
import { RoleEntity } from '../entity/role';

export class RoleDTO extends BaseDTO<RoleEntity> {
  @ApiProperty({ description: '角色编码' })
  @Rule(requiredString.error(R.validateError('代码不能为空')))
  code?: string;

  @ApiProperty({ description: '角色名称' })
  @Rule(requiredString.error(R.validateError('名称不能为空')))
  name?: string;

  @ApiProperty({
    description: '分配菜单列表',
    type: 'array',
    items: { type: 'string' },
  })
  @Rule(RuleType.array<string>())
  menuIds?: string[];
}
