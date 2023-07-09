import { Rule } from '@midwayjs/validate';
import { R } from '../../../common/base.error.util';
import { MenuEntity } from '../entity/menu';
import {
  bool,
  requiredString,
  string,
  requiredNumber,
} from '../../../common/common.validate.rules';
import { BaseDTO } from '../../../common/base.dto';

export class MenuDTO extends BaseDTO<MenuEntity> {
  @Rule(string.allow(null))
  parentId?: string;
  @Rule(requiredString.error(R.validateError('名称不能为空')))
  name?: string;
  @Rule(string.allow(null))
  icon?: string;
  @Rule(requiredNumber.error(R.validateError('类型不能为空')))
  type?: number;
  @Rule(requiredString.error(R.validateError('路由不能为空')))
  route?: string;
  @Rule(string.allow(null))
  filePath?: string;
  @Rule(requiredNumber.error(R.validateError('排序号不能为空')))
  orderNumber?: number;
  @Rule(string.allow(null))
  url?: string;
  @Rule(bool.allow(null))
  show?: boolean;
}
