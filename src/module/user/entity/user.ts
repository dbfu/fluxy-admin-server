import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { omit } from 'lodash';
import { UserVO } from '../vo/user';
import { FileEntity } from '../../file/entity/file';

@Entity('sys_user')
export class UserEntity extends BaseEntity {
  @Column({ comment: '用户名称' })
  userName: string;
  @Column({ comment: '用户昵称' })
  nickName: string;
  @Column({ comment: '手机号' })
  phoneNumber: string;
  @Column({ comment: '邮箱' })
  email: string;
  @Column({ comment: '头像', nullable: true })
  avatar?: number;
  @Column({ comment: '性别（0:女，1:男）', nullable: true })
  sex?: number;
  @Column({ comment: '密码' })
  password: string;
  toVO(): UserVO {
    const userVO = omit<UserEntity>(this, ['password', 'avatar']) as UserVO;
    userVO.avatarPath = this.avatarEntity?.filePath;
    return userVO;
  }

  avatarEntity?: FileEntity;
}
