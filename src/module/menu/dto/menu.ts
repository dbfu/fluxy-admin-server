import { Rule, RuleType, getSchema } from '@midwayjs/validate';
import { BaseDTO } from '../../../common/base.dto';
import { R } from '../../../common/base.error.util';
import {
  bool,
  number,
  requiredNumber,
  requiredString,
  string,
} from '../../../common/common.validate.rules';
import { ApiDTO } from '../../api/dto/api';
import { MenuEntity } from '../entity/menu';

export class MenuDTO extends BaseDTO<MenuEntity> {
  @Rule(string.allow(null))
  parentId?: string;
  @Rule(requiredString.error(R.validateError('名称不能为空')))
  name?: string;
  @Rule(string.allow(null))
  icon?: string;
  @Rule(requiredNumber.error(R.validateError('类型不能为空')))
  type?: number;
  @Rule(string.allow(null))
  route?: string;
  @Rule(string.allow(null))
  filePath?: string;
  @Rule(number.allow(null))
  orderNumber?: number;
  @Rule(string.allow(null))
  url?: string;
  @Rule(bool.allow(null))
  show?: boolean;
  @Rule(string.allow(null))
  authCode?: string;
  @Rule(string.allow(null))
  pageSetting?: string;
  @Rule(RuleType.array().items(getSchema(ApiDTO)).allow(null))
  apis?: ApiDTO[];
}
