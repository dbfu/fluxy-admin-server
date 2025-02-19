import { createWatcher } from '@midwayjs/casbin-redis-adapter';
import { MidwayAppInfo, RouterOption } from '@midwayjs/core';
import * as redisStore from 'cache-manager-ioredis';
import { join } from 'path';
import { env } from 'process';
import { MailConfig, MinioConfig, TokenConfig } from '../interface';
import { EverythingSubscriber } from '../typeorm-event-subscriber';

import { CasbinRule, createAdapter } from '@midwayjs/casbin-typeorm-adapter';

export default (appInfo: MidwayAppInfo) => {
  return {
    // use for cookie sign key, should change to your own and keep security
    keys: '1684629293601_5943',
    koa: {
      port: 7001,
      globalPrefix: '/api',
    },
    typeorm: {
      dataSource: {
        default: {
          /**
           * 单数据库实例
           */
          type: 'mysql',
          host: 'localhost', // 数据库ip地址，本地就写localhost
          port: 3306,
          username: 'root',
          password: '12345678',
          database: 'fluxy-admin', // 数据库名称
          synchronize: true, // 如果第一次使用，不存在表，有同步的需求可以写 true，注意会丢数据
          logging: true,
          // 扫描entity文件夹
          entities: ['**/entity/*{.ts,.js}', CasbinRule],
          timezone: '+00:00',
          migrations: ['**/migration/*.ts', CasbinRule],
          cli: {
            migrationsDir: 'migration',
          },
          subscribers: [EverythingSubscriber],
          maxQueryExecutionTime: 10,
        },
      },
    },
    redis: {
      clients: {
        default: {
          port: 6379, // Redis port
          host: env.REDIS_HOST || 'localhost', // Redis host
          password: env.REDIS_PASSWORD || '',
          db: 0,
        },
        publish: {
          port: 6379, // Redis port
          host: env.REDIS_HOST || 'localhost', // Redis host
          password: env.REDIS_PASSWORD || '',
          db: 1,
        },
        subscribe: {
          port: 6379, // Redis port
          host: env.REDIS_HOST || 'localhost', // Redis host
          password: env.REDIS_PASSWORD || '',
          db: 2,
        },
        'node-casbin-official': {
          port: 6379, // Redis port
          host: env.REDIS_HOST || 'localhost', // Redis host
          password: env.REDIS_PASSWORD || '',
          db: 3,
        },
        'node-casbin-sub': {
          port: 6379, // Redis port
          host: env.REDIS_HOST || 'localhost', // Redis host
          password: env.REDIS_PASSWORD || '',
          db: 3,
        },
      },
    },
    validate: {
      validationOptions: {
        allowUnknown: true,
      },
    },
    token: {
      expire: 60 * 60 * 2, // 2小时
      refreshExpire: 60 * 60 * 24 * 7, // 7天
    } as TokenConfig,
    cache: {
      store: redisStore,
      options: {
        host: env.REDIS_HOST || 'localhost', // default value
        port: 6379, // default value
        password: env.REDIS_PASSWORD || '',
        db: 0,
        keyPrefix: 'cache:',
        ttl: 100,
      },
    },
    captcha: {
      default: {
        size: 4,
        noise: 1,
        width: 120,
        height: 40,
      },
      image: {
        type: 'mixed',
      },
      formula: {},
      text: {},
      expirationTime: 3600,
      idPrefix: 'captcha',
    },
    minio: {
      endPoint: env.MINIO_HOST || 'localhost',
      port: env.MINIO_PORT ? Number(env.MINIO_PORT) : 9002,
      useSSL: false,
      accessKey: env.MINIO_ACCESS_KEY || 'root',
      secretKey: env.MINIO_SECRET_KEY || '12345678',
      bucketName: env.MINIO_BUCKET_NAME || 'fluxy-admin',
    } as MinioConfig,
    bull: {
      defaultQueueOptions: {
        redis: {
          port: 6379,
          host: env.REDIS_HOST || 'localhost',
          password: env.REDIS_PASSWORD || '',
        },
      },
    },
    mail: {
      host: env.MAIL_HOST || 'smtp.163.com',
      port: env.MAIL_PORT ? Number(env.MAIL_PORT) : 465,
      secure: true,
      auth: {
        user: env.MAIL_USER || '18256485741@163.com',
        pass: env.MAIL_PASS,
      },
    } as MailConfig,
    casbin: {
      modelPath: join(appInfo.baseDir, 'basic_model.conf'),
      policyAdapter: createAdapter({
        dataSourceName: 'default',
      }),
      policyWatcher: createWatcher({
        pubClientName: 'node-casbin-official',
        subClientName: 'node-casbin-sub',
      }),
    },
    swagger: {
      documentOptions: {
        operationIdFactory(controllerKey: string, webRouter: RouterOption) {
          return `${webRouter.method}`;
        },
      },
    },
    resetPasswordCallbackUrl: 'http://localhost:5173',
  };
};
