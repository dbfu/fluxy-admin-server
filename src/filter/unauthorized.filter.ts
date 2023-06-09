import { Catch } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { httpError } from '@midwayjs/core';
import { UnauthorizedError } from '@midwayjs/core/dist/error/http';
import { MidwayI18nService } from '@midwayjs/i18n';

@Catch(httpError.UnauthorizedError)
export class UnauthorizedErrorFilter {
  async catch(err: UnauthorizedError, ctx: Context) {
    // 获取国际化服务
    const i18nService = await ctx.requestContext.getAsync(MidwayI18nService);
    // 翻译
    const message = i18nService.translate(err.message) || err.message;
    ctx.status = 401;
    return {
      code: 401,
      message,
    };
  }
}
