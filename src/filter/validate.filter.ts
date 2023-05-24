import { Catch } from '@midwayjs/decorator';
import { MidwayValidationError } from '@midwayjs/validate';
import { Context } from '@midwayjs/koa';
import { MidwayI18nService } from '@midwayjs/i18n';

@Catch(MidwayValidationError)
export class ValidateErrorFilter {
  async catch(err: MidwayValidationError, ctx: Context) {
    // 获取国际化服务
    const i18nService = await ctx.requestContext.getAsync(MidwayI18nService);
    // 翻译
    const message = i18nService.translate(err.message) || err.message;
    // 未捕获的错误，是系统错误，错误码是500
    ctx.status = 422;
    return {
      code: 422,
      message,
    };
  }
}
