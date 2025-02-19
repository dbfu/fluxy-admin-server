import { Catch } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { ApiLogService } from '../module/system/api-log/service/api-log';
@Catch()
export class DefaultErrorFilter {
  async catch(err: Error, ctx: Context) {
    const apiLogService = await ctx.requestContext.getAsync<ApiLogService>(
      ApiLogService
    );

    apiLogService.createApiLog(ctx, false, '500', err.message);

    ctx.logger.error(err);
    ctx.status = 500;

    return {
      code: 500,
      message: '系统错误',
    };
  }
}
