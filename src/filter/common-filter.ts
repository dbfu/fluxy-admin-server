import { Catch } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { CommonError } from '../common/common-error';
import { ApiLogService } from '../module/system/api-log/service/api-log';

@Catch(CommonError)
export class CommonErrorFilter {
  async catch(err: CommonError, ctx: Context) {
    const message = err.message;

    const apiLogService = await ctx.requestContext.getAsync<ApiLogService>(
      ApiLogService
    );

    apiLogService.createApiLog(ctx, false, '400', message);

    ctx.status = 400;
    return {
      code: 400,
      message,
    };
  }
}
