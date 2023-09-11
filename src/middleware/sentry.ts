import { Middleware, IMiddleware } from '@midwayjs/core';
import { NextFunction, Context } from '@midwayjs/koa';
import * as Sentry from '@sentry/node';
import { stripUrlQueryAndFragment } from '@sentry/utils';

@Middleware()
export class SentryMiddleware implements IMiddleware<Context, NextFunction> {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      return new Promise<void>(resolve => {
        Sentry.runWithAsyncContext(() => {
          const hub = Sentry.getCurrentHub();
          hub.configureScope(async scope => {
            scope.addEventProcessor(event => {
              return Sentry.addRequestDataToEvent(event, ctx.request);
            });

            const reqMethod = (ctx.method || '').toUpperCase();
            const reqUrl = ctx.url && stripUrlQueryAndFragment(ctx.url);

            const transaction = Sentry.startTransaction({
              name: `${reqMethod} ${reqUrl}`,
              op: 'api',
            });

            Sentry.getCurrentHub().configureScope(scope => {
              scope.setSpan(transaction);
            });

            ctx.__sentry_transaction = transaction;
            await next();

            if (ctx._matchedRoute) {
              const mountPath = ctx.mountPath || '';
              transaction.setName(
                `${reqMethod} ${mountPath}${ctx._matchedRoute}`
              );
            }
            transaction.setHttpStatus(ctx.status);
            transaction.finish();

            resolve();
          });
        });
      });
    };
  }

  static getName(): string {
    return 'sentry';
  }
}
