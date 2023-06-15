import { Configuration, App } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import { join } from 'path';
import * as orm from '@midwayjs/typeorm';
import * as redis from '@midwayjs/redis';
import * as swagger from '@midwayjs/swagger';
import * as i18n from '@midwayjs/i18n';
import * as cache from '@midwayjs/cache';
import * as upload from '@midwayjs/upload';
import * as bull from '@midwayjs/bull';
// import { DefaultErrorFilter } from './filter/default.filter';
import { NotFoundFilter } from './filter/notfound.filter';
import { AuthMiddleware } from './middleware/auth';
import { ValidateErrorFilter } from './filter/validate.filter';
import { CommonErrorFilter } from './filter/common.filter';
import { UnauthorizedErrorFilter } from './filter/unauthorized.filter';
import { DefaultErrorFilter } from './filter/default.filter';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { UserEntity } from './module/user/entity/user';
import { Repository } from 'typeorm';

@Configuration({
  imports: [
    koa,
    i18n,
    validate,
    orm,
    redis,
    cache,
    upload,
    bull,
    {
      component: swagger,
      enabledEnvironment: ['local'],
    },
    {
      component: info,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle {
  @App()
  app: koa.Application;
  @InjectEntityModel(UserEntity)
  userModel: Repository<UserEntity>;

  async onReady() {
    // add middleware
    this.app.useMiddleware([AuthMiddleware]);
    // add filter
    this.app.useFilter([
      ValidateErrorFilter,
      CommonErrorFilter,
      NotFoundFilter,
      UnauthorizedErrorFilter,
      DefaultErrorFilter,
    ]);

    console.log(this.userModel, 'this.userModel');

    const userCount = await this.userModel.count();

    if (userCount === 0) {
      console.log('检测到管理员账号不存在，正在为你创建。');
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
