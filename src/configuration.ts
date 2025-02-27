import * as bull from '@midwayjs/bull';
import * as cache from '@midwayjs/cache';
import { App, Config, Configuration, Inject } from '@midwayjs/core';
import * as info from '@midwayjs/info';
import * as koa from '@midwayjs/koa';
import * as redis from '@midwayjs/redis';
import * as swagger from '@midwayjs/swagger';
import * as orm from '@midwayjs/typeorm';
import * as upload from '@midwayjs/upload';
import * as validate from '@midwayjs/validate';
import { join } from 'path';
// import { DefaultErrorFilter } from './filter/default.filter';
import * as casbin from '@midwayjs/casbin';
import { CasbinEnforcerService } from '@midwayjs/casbin';
import { InjectDataSource } from '@midwayjs/typeorm';
import * as ws from '@midwayjs/ws';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { CommonErrorFilter } from './filter/common-filter';
import { DefaultErrorFilter } from './filter/default-filter';
import { ForbiddenErrorFilter } from './filter/forbidden-filter';
import { NotFoundFilter } from './filter/notfound-filter';
import { UnauthorizedErrorFilter } from './filter/unauthorized-filter';
import { ValidateErrorFilter } from './filter/validate-filter';
import { AuthMiddleware } from './middleware/auth';
import { ReportMiddleware } from './middleware/report';
import { UserEntity } from './module/system/user/entity/user';

dotenv.config();

@Configuration({
  imports: [
    koa,
    validate,
    orm,
    redis,
    cache,
    upload,
    bull,
    ws,
    {
      component: swagger,
      enabledEnvironment: ['local'],
    },
    {
      component: info,
      enabledEnvironment: ['local'],
    },
    casbin,
  ],
  importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle {
  @App()
  app: koa.Application;
  @Inject()
  casbinEnforcerService: CasbinEnforcerService;
  @Inject()
  bullFramework: bull.Framework;
  @InjectDataSource('default')
  defaultDataSource: DataSource;
  @Config('autoResetDataBase')
  autoResetDataBase: boolean;

  async onReady() {
    // add middleware
    this.app.useMiddleware([ReportMiddleware, AuthMiddleware]);
    // add filter
    this.app.useFilter([
      ForbiddenErrorFilter,
      ValidateErrorFilter,
      CommonErrorFilter,
      NotFoundFilter,
      UnauthorizedErrorFilter,
      DefaultErrorFilter,
    ]);

    this.casbinEnforcerService.enableAutoSave(false);
  }

  async onServerReady() {
    // 检测数据库里有没有数据，如果没有数据，则初始化数据库
    if (
      (await this.defaultDataSource.getRepository(UserEntity).count()) === 0
    ) {
      const initDatabaseQueue = this.bullFramework.getQueue('init-database');
      // 立即执行这个任务
      await initDatabaseQueue?.runJob({});
    }

    // 如果开启自动重置数据库，则设置一个定时任务，每天0点重置数据库
    if (this.autoResetDataBase) {
      const initDatabaseQueue = this.bullFramework.getQueue('init-database');
      await initDatabaseQueue?.runJob({}, { repeat: { cron: '0 0 0 * * *' } });
    }
  }
}
