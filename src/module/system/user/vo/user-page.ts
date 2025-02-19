import { PageVOWrapper } from '../../../../common/page-result-vo';
import { UserVO } from './user';

export class UserPageVO extends PageVOWrapper<UserVO>(UserVO) {}
