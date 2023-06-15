import { Singleton } from '@midwayjs/core';
import { Autoload, Init } from '@midwayjs/decorator';
import * as Minio from 'minio';

import { UserEntity } from '../module/user/entity/user';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';

export type MinioClient = Minio.Client;

@Autoload()
@Singleton()
export class InitUserAutoLoad {
  @InjectEntityModel(UserEntity)
  userModel: Repository<UserEntity>;

  @Init()
  async init() {
    const userCount = await this.userModel.count();

    if (userCount === 0) {
      const adminUser = new UserEntity();
      adminUser.nickName = '管理员';
      adminUser.password =
        '$2a$10$.OggYJaVe1OCLVSB/9wqk.bYYaSdvcHu7dcc0zpewfpzNKEDPh2Tu';
      adminUser.email = 'admin@qq.com';
      adminUser.phoneNumber = '18144444444';
      adminUser.userName = 'admin';

      await this.userModel.save(adminUser);
    }
  }
}
