import { LoginLogEntity } from '../entity/login.log';
import { PickVO } from '../../../utils/vo.utils';

// eslint-disable-next-line prettier/prettier
export class LoginLogVO extends PickVO(LoginLogEntity, []) {}
