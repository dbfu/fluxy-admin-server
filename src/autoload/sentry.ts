import { Singleton } from '@midwayjs/core';
import { Autoload, Init } from '@midwayjs/decorator';
import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';

@Autoload()
@Singleton()
export class SentryAutoLoad {
  @Init()
  async init() {
    Sentry.init({
      dsn: 'https://a13145093dc52e958bad4bf774c0a68f@o4505777802444800.ingest.sentry.io/4505839443443712',
      integrations: [
        // Automatically instrument Node.js libraries and frameworks
        ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
        new ProfilingIntegration(),
      ],
      // Performance Monitoring
      tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
      // Set sampling rate for profiling - this is relative to tracesSampleRate
      profilesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
    });
  }
}
