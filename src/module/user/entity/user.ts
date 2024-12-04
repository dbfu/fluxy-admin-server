import { BaseEntity } from '../../../common/base.entity';
import { omit } from 'lodash';
import { UserVO } from '../vo/user';
import { RoleEntity } from '../../role/entity/role';
import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { MenuEntity } from '../../menu/entity/menu';
import { FileEntity } from '../../file/entity/file';

@Entity({ tableName: 'sys_user' })
export class UserEntity extends BaseEntity {
  @Property({ comment: '用户名称' })
  userName: string;
  @Property({ comment: '用户昵称' })
  nickName: string;
  @Property({ comment: '手机号' })
  phoneNumber: string;
  @Property({ comment: '邮箱' })
  email: string;
  @Property({ comment: '性别（0:女，1:男）', nullable: true })
  sex?: number;
  @Property({ comment: '密码' })
  password: string;
  toVO(): UserVO {
    const userVO = omit<UserEntity>(this.toObject(), ['password']) as UserVO;
    userVO.avatarPath = this.avatar?.filePath;
    return userVO;
  }

  @ManyToOne()
  avatar?: FileEntity;

  @ManyToMany({ entity: () => RoleEntity, mappedBy: 'users' })
  roles = new Collection<RoleEntity>(this);
  menus: MenuEntity[];
}
