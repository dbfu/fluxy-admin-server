import { Inject, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { omit } from 'lodash';

import { BaseService } from '../../../common/base.service';
import { UserEntity } from '../entity/user';
import { R } from '../../../common/base.error.util';
import { UserVO } from '../vo/user';
import { FileService } from '../../file/service/file';
import { FileEntity } from '../../file/entity/file';

@Provide()
export class UserService extends BaseService<UserEntity> {
  @InjectEntityModel(UserEntity)
  userModel: Repository<UserEntity>;
  @Inject()
  fileService: FileService;

  getModel(): Repository<UserEntity> {
    return this.userModel;
  }

  async create(entity: UserEntity): Promise<UserVO> {
    const { userName, phoneNumber, email } = entity;

    let isExist = (await this.userModel.countBy({ userName })) > 0;

    if (isExist) {
      throw R.error('当前用户名已存在');
    }

    isExist = (await this.userModel.countBy({ phoneNumber })) > 0;

    if (isExist) {
      throw R.error('当前手机号已存在');
    }

    isExist = (await this.userModel.countBy({ email })) > 0;

    if (isExist) {
      throw R.error('当前邮箱已存在');
    }

    // 添加用户的默认密码是123456，对密码进行加盐加密
    const password = bcrypt.hashSync('123456', 10);

    entity.password = password;

    await this.userModel.save(entity);

    if (entity.avatar) {
      await this.fileService.setPKValue(entity.avatar, entity.id);
    }

    // 把entity中的password移除返回给前端
    return omit(entity, ['password']) as UserVO;
  }

  async edit(entity: UserEntity): Promise<void | UserVO> {
    const { userName, phoneNumber, email, id } = entity;
    let user = await this.userModel.findOneBy({ userName });

    if (user && user.id !== id) {
      throw R.error('当前用户名已存在');
    }

    user = await this.userModel.findOneBy({ phoneNumber });

    if (user && user.id !== id) {
      throw R.error('当前手机号已存在');
    }

    user = await this.userModel.findOneBy({ email });

    if (user && user.id !== id) {
      throw R.error('当前邮箱已存在');
    }

    await this.userModel.save(entity);

    return omit(entity, ['password']) as UserVO;
  }

  async page<T>(page = 0, pageSize = 10, where?: FindOptionsWhere<T>) {
    const [data, total] = await this.userModel
      .createQueryBuilder('t')
      .leftJoinAndMapOne(
        't.avatarEntity',
        FileEntity,
        'file',
        'file.id = t.avatar'
      )
      .where(where)
      .skip(page)
      .take(page * pageSize)
      .orderBy('t.createDate', 'DESC')
      .getManyAndCount();

    return {
      data: data.map(entity => entity.toVO()),
      total,
    };
  }
}
