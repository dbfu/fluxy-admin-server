import { Configuration, App, Inject } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import { join } from 'path';
import * as mikro from '@midwayjs/mikro';
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
import * as dotenv from 'dotenv';
import * as ws from '@midwayjs/ws';
import { CasbinEnforcerService } from '@midwayjs/casbin';
import * as casbin from '@midwayjs/casbin';

dotenv.config();

@Configuration({
  imports: [
    koa,
    i18n,
    validate,
    mikro,
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

    this.casbinEnforcerService.enableAutoSave(false);
  }
}
