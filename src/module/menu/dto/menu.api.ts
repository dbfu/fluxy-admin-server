import { Rule, RuleType } from '@midwayjs/validate';
import { R } from '../../../common/base.error.util';
import { MenuApiEntity } from '../entity/menu.api';
import { requiredString } from '../../../common/common.validate.rules';
import { ApiDTO } from '../../api/dto/api';

export class MenuInterfaceDTO extends MenuApiEntity {
  @Rule(requiredString.error(R.validateError('menu_id不能为空')))
  menu_id?: string;
  @Rule(RuleType.array())
  interface_infos: ApiDTO[];
}
