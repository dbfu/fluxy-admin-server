import {
  Middleware,
  IMiddleware,
  Inject,
  MidwayWebRouterService,
  RouterInfo,
} from '@midwayjs/core';
import { NextFunction, Context } from '@midwayjs/koa';
import { R } from '../common/base.error.util';
import { RedisService } from '@midwayjs/redis';

@Middleware()
export class AuthMiddleware implements IMiddleware<Context, NextFunction> {
  @Inject()
  redisService: RedisService;
  @Inject()
  webRouterService: MidwayWebRouterService;
  @Inject()
  notLoginRouters: RouterInfo[];

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const routeInfo = await this.webRouterService.getMatchedRouterInfo(
        ctx.path,
        ctx.method
      );

      if (!routeInfo) {
        await next();
        return;
      }

      if (
        this.notLoginRouters.some(
          o =>
            o.requestMethod === routeInfo.requestMethod &&
            o.url === routeInfo.url
        )
      ) {
        await next();
        return;
      }

      const token = ctx.header.authorization?.replace('Bearer ', '');
      if (!token) {
        throw R.unauthorizedError('未授权');
      }

      const userInfoStr = await this.redisService.get(`token:${token}`);
      if (!userInfoStr) {
        throw R.unauthorizedError('未授权');
      }

      const userInfo = JSON.parse(userInfoStr);

      ctx.userInfo = userInfo;
      ctx.token = token;
      return next();
    };
  }

  static getName(): string {
    return 'auth';
  }
}
