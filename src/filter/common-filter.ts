import { Catch } from '@midwayjs/decorator';
import { MidwayI18nService } from '@midwayjs/i18n';
import { Context } from '@midwayjs/koa';
import { CommonError } from '../common/common-error';
import { ApiLogService } from '../module/system/api-log/service/api-log';

@Catch(CommonError)
export class CommonErrorFilter {
  async catch(err: CommonError, ctx: Context) {
    // 获取国际化服务
    const i18nService = await ctx.requestContext.getAsync(MidwayI18nService);
    // 翻译
    const message = i18nService.translate(err.message) || err.message;

    console.log(
      'error time: ' +
        (new Date().getTime() - ctx.requestStartTime.getTime()) / 1000
    );

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
