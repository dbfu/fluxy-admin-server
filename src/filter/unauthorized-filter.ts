import { httpError } from '@midwayjs/core';
import { UnauthorizedError } from '@midwayjs/core/dist/error/http';
import { Catch } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { ApiLogService } from '../module/system/api-log/service/api-log';

@Catch(httpError.UnauthorizedError)
export class UnauthorizedErrorFilter {
  async catch(err: UnauthorizedError, ctx: Context) {
    const message = err.message;

    const apiLogService = await ctx.requestContext.getAsync<ApiLogService>(
      ApiLogService
    );

    apiLogService.createApiLog(ctx, false, '401', message);

    ctx.status = 401;
    return {
      code: 401,
      message,
    };
  }
}
