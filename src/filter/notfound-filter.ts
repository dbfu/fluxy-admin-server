import { Catch, httpError, MidwayHttpError } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { ApiLogService } from '../module/system/api-log/service/api-log';

@Catch(httpError.NotFoundError)
export class NotFoundFilter {
  async catch(err: MidwayHttpError, ctx: Context) {
    const message = '请求地址不存在';

    const apiLogService = await ctx.requestContext.getAsync<ApiLogService>(
      ApiLogService
    );

    apiLogService.createApiLog(ctx, false, '404', message);

    ctx.status = 404;
    return {
      code: 404,
      message,
    };
  }
}
