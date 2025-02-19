import * as bull from '@midwayjs/bull';
import * as cache from '@midwayjs/cache';
import { App, Configuration, Inject } from '@midwayjs/core';
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
import * as ws from '@midwayjs/ws';
import * as dotenv from 'dotenv';
import { CommonErrorFilter } from './filter/common-filter';
import { DefaultErrorFilter } from './filter/default-filter';
import { ForbiddenErrorFilter } from './filter/forbidden-filter';
import { NotFoundFilter } from './filter/notfound-filter';
import { UnauthorizedErrorFilter } from './filter/unauthorized-filter';
import { ValidateErrorFilter } from './filter/validate-filter';
import { AuthMiddleware } from './middleware/auth';
import { ReportMiddleware } from './middleware/report';

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

    this.bullFramework.createQueue('init-database', {
      defaultJobOptions: {
        repeat: { cron: '0 */2 * * * *' },
      },
    });
  }
}
