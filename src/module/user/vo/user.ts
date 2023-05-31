import { UserEntity } from '../entity/user';
import { OmitVO } from '../../../utils/vo.utils';

export class UserVO extends OmitVO(UserEntity, ['password']) {}
