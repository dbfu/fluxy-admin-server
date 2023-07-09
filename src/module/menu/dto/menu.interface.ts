import { Rule, RuleType } from '@midwayjs/validate';
import { R } from '../../../common/base.error.util';
import { MenuInterfaceEntity } from '../entity/menu.interface';
import { InterfaceDTO } from './interface';
import { requiredString } from '../../../common/common.validate.rules';

export class MenuInterfaceDTO extends MenuInterfaceEntity {
  @Rule(requiredString.error(R.validateError('menu_id不能为空')))
  menu_id?: string;
  @Rule(RuleType.array())
  interface_infos: InterfaceDTO[];
}
