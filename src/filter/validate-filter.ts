import { Catch } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { MidwayValidationError } from '@midwayjs/validate';
import { ApiLogService } from '../module/system/api-log/service/api-log';

@Catch(MidwayValidationError)
export class ValidateErrorFilter {
  async catch(err: MidwayValidationError, ctx: Context) {
    const message = err.message;

    const apiLogService = await ctx.requestContext.getAsync<ApiLogService>(
      ApiLogService
    );

    apiLogService.createApiLog(ctx, false, '422', message);

    ctx.status = 422;
    return {
      code: 422,
      message,
    };
  }
}
