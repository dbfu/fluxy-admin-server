import { CasbinEnforcerService } from '@midwayjs/casbin';
import {
  Config,
  IMiddleware,
  Inject,
  Middleware,
  MidwayWebRouterService,
  RouterInfo,
} from '@midwayjs/core';
import { Context, NextFunction } from '@midwayjs/koa';
import { RedisService } from '@midwayjs/redis';
import { ApiLogService } from '../module/system/api-log/service/api-log';

@Middleware()
export class ReportMiddleware implements IMiddleware<Context, NextFunction> {
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
      ctx.requestStartTime = new Date();

      await next();

      const apiLogService = await ctx.requestContext.getAsync<ApiLogService>(
        ApiLogService
      );

      apiLogService.createApiLog(ctx, true);
    };
  }

  static getName(): string {
    return 'report';
  }
}
