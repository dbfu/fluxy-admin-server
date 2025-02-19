import { ApiExtraModel, ApiProperty, getSchemaPath } from '@midwayjs/swagger';
import { Rule, RuleType, getSchema } from '@midwayjs/validate';
import { BaseDTO } from '../../../../common/base-dto';
import { R } from '../../../../common/base-error-util';
import {
  bool,
  number,
  requiredNumber,
  requiredString,
  string,
} from '../../../../common/common-validate-rules';
import { ApiDTO } from '../../api/dto/api';
import { MenuEntity } from '../entity/menu';

@ApiExtraModel(ApiDTO)
export class MenuDTO extends BaseDTO<MenuEntity> {
  @ApiProperty({ description: '父级菜单id' })
  @Rule(string.allow(null))
  parentId?: string;

  @ApiProperty({ description: '菜单名称' })
  @Rule(requiredString.error(R.validateError('名称不能为空')))
  name?: string;

  @ApiProperty({ description: '菜单icon' })
  @Rule(string.allow(null))
  icon?: string;

  @ApiProperty({ description: '菜单类型' })
  @Rule(requiredNumber.error(R.validateError('类型不能为空')))
  type?: number;

  @ApiProperty({ description: '菜单路由' })
  @Rule(string.allow(null))
  route?: string;

  @ApiProperty({ description: '本地组件地址' })
  @Rule(string.allow(null))
  filePath?: string;

  @ApiProperty({ description: '菜单排序' })
  @Rule(number.allow(null))
  orderNumber?: number;

  @ApiProperty({ description: '菜单url' })
  @Rule(string.allow(null))
  url?: string;

  @ApiProperty({ description: '是否在菜单中显示' })
  @Rule(bool.allow(null))
  show?: boolean;

  @ApiProperty({ description: '权限码' })
  @Rule(string.allow(null))
  authCode?: string;

  @ApiProperty({ description: '低代码页面配置数据' })
  @Rule(string.allow(null))
  pageSetting?: string;

  @ApiProperty({
    description: '已分配接口列表',
    type: 'array',
    items: { $ref: getSchemaPath(ApiDTO) },
  })
  @Rule(RuleType.array().items(getSchema(ApiDTO)).allow(null))
  apis?: ApiDTO[];
}
