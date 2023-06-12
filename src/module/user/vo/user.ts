import { UserEntity } from '../entity/user';
import { OmitVO } from '../../../utils/vo.utils';

// eslint-disable-next-line prettier/prettier
export class UserVO extends OmitVO(UserEntity, ['password', 'avatar']) {
  avatarPath?: string;
}
