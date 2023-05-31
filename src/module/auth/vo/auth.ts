import { AuthEntity } from '../entity/auth';
import { PickVO } from '../../../utils/vo.utils';

// eslint-disable-next-line prettier/prettier
export class AuthVO extends PickVO(AuthEntity, []) {}
