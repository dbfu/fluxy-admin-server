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
import * as dotenv from 'dotenv';

dotenv.config();

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
  }
}
