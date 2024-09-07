import { Catch } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import * as Sentry from '@sentry/node';
@Catch()
export class DefaultErrorFilter {
  async catch(err: Error, ctx: Context) {
    // 捕获异常，并把异常和接口绑定一起上报
    Sentry.withScope(scope => {
      scope.addEventProcessor(event => {
        return Sentry.addRequestDataToEvent(event, ctx.request);
      });
      Sentry.captureException(err, { user: { id: ctx?.userInfo?.userId } });
    });

    ctx.logger.error(err);

    ctx.status = 500;

    return {
      code: 500,
      message: '系统错误',
    };
  }
}
