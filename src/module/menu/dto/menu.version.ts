import { Rule } from '@midwayjs/validate';
import { BaseDTO } from '../../../common/base.dto';
import { R } from '../../../common/base.error.util';
import { requiredString } from '../../../common/common.validate.rules';
import { MenuVersionEntity } from '../entity/menu.version';

export class MenuVersionDTO extends BaseDTO<MenuVersionEntity> {
  @Rule(requiredString.error(R.validateError('菜单id不能为空')))
  menuId: string;
  @Rule(requiredString.error(R.validateError('版本号描述不能为空')))
  description: string;
  @Rule(requiredString.error(R.validateError('版本号不能为空')))
  version: string;
  @Rule(requiredString.error(R.validateError('低代码配置不能为空')))
  pageSetting: string;
}
