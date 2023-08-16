import {
  Middleware,
  IMiddleware,
  Inject,
  MidwayWebRouterService,
  RouterInfo,
  Config,
} from '@midwayjs/core';
import { NextFunction, Context } from '@midwayjs/koa';
import { R } from '../common/base.error.util';
import { RedisService } from '@midwayjs/redis';
import { CasbinEnforcerService } from '@midwayjs/casbin';
import { getUrlExcludeGlobalPrefix } from '../utils/utils';

@Middleware()
export class AuthMiddleware implements IMiddleware<Context, NextFunction> {
  @Inject()
  redisService: RedisService;
  @Inject()
  webRouterService: MidwayWebRouterService;
  @Inject()
  notLoginRouters: RouterInfo[];
  @Inject()
  notAuthRouters: RouterInfo[];
  @Config('koa.globalPrefix')
  globalPrefix: string;
  @Inject()
  casbinEnforcerService: CasbinEnforcerService;

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

      // 过滤掉不需要鉴权的接口
      if (
        this.notAuthRouters.some(
          o =>
            o.requestMethod === routeInfo.requestMethod &&
            o.url === routeInfo.url
        )
      ) {
        await next();
        return;
      }

      const matched = await this.casbinEnforcerService.enforce(
        ctx.userInfo.userId,
        getUrlExcludeGlobalPrefix(this.globalPrefix, routeInfo.fullUrl),
        routeInfo.requestMethod
      );

      if (!matched && ctx.userInfo.userId !== '1') {
        throw R.forbiddenError('你没有访问该资源的权限');
      }

      return next();
    };
  }

  static getName(): string {
    return 'auth';
  }
}
