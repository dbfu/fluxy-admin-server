import { Catch, httpError, MidwayHttpError } from '@midwayjs/core';
import { MidwayI18nService } from '@midwayjs/i18n';
import { Context } from '@midwayjs/koa';

@Catch(httpError.NotFoundError)
export class NotFoundFilter {
  async catch(err: MidwayHttpError, ctx: Context) {
    const i18nService = await ctx.requestContext.getAsync(MidwayI18nService);
    const message = i18nService.translate('not.found');
    ctx.status = 404;
    return {
      code: 404,
      message,
    };
  }
}
