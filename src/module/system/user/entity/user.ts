import { omit } from 'lodash';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../../common/base-entity';
import { FileEntity } from '../../file/entity/file';
import { RoleEntity } from '../../role/entity/role';
import { UserVO } from '../vo/user';

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
  @Column({ comment: '性别（0:女，1:男）', nullable: true })
  sex?: number;
  @Column({ comment: '密码' })
  password: string;
  toVO(): UserVO {
    const userVO = omit<UserEntity>(this, ['password']) as UserVO;
    userVO.avatarPath = this.avatar?.filePath || null;
    return userVO;
  }

  avatar?: FileEntity;
  roles: RoleEntity[];
}
