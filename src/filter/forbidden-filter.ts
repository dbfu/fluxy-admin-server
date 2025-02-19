import { httpError } from '@midwayjs/core';
import { Catch } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { MidwayValidationError } from '@midwayjs/validate';
import { ApiLogService } from '../module/system/api-log/service/api-log';

@Catch(httpError.ForbiddenError)
export class ForbiddenErrorFilter {
  async catch(err: MidwayValidationError, ctx: Context) {
    const message = err.message;

    const apiLogService = await ctx.requestContext.getAsync<ApiLogService>(
      ApiLogService
    );

    apiLogService.createApiLog(ctx, false, '403', message);

    ctx.status = 403;
    return {
      code: 403,
      message,
    };
  }
}
