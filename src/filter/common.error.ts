import { Catch } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { CommonError } from '../common/common.error';
import { MidwayI18nService } from '@midwayjs/i18n';

@Catch(CommonError)
export class CommonErrorFilter {
  async catch(err: CommonError, ctx: Context) {
    // 获取国际化服务
    const i18nService = await ctx.requestContext.getAsync(MidwayI18nService);
    // 翻译
    const message = i18nService.translate(err.message) || err.message;
    // 未捕获的错误，是系统错误，错误码是500
    ctx.status = 400;
    return {
      code: 400,
      message,
    };
  }
}
