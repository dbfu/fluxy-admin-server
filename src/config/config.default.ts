import { createWatcher } from '@midwayjs/casbin-redis-adapter';
import { MidwayAppInfo, RouterOption } from '@midwayjs/core';
import * as redisStore from 'cache-manager-ioredis';
import { join } from 'path';
import { env } from 'process';
import { MailConfig, MinioConfig, TokenConfig } from '../interface';
import { EverythingSubscriber } from '../typeorm-event-subscriber';

import { CasbinRule, createAdapter } from '@midwayjs/casbin-typeorm-adapter';
import { uploadWhiteList } from '@midwayjs/upload';

export default (appInfo: MidwayAppInfo) => {
  return {
    keys: '1684629293601_5943',
    // 邮件中的系统名称
    title: 'fluxy-admin',
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
          host: env.DB_HOST,
          port: env.DB_PORT ? Number(env.DB_PORT) : 3306,
          username: env.DB_USERNAME,
          password: env.DB_PASSWORD,
          database: env.DB_NAME,
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
          port: env.REDIS_PORT, // Redis port
          host: env.REDIS_HOST, // Redis host
          password: env.REDIS_PASSWORD || '',
          db: 0,
        },
        publish: {
          port: env.REDIS_PORT, // Redis port
          host: env.REDIS_HOST, // Redis host
          password: env.REDIS_PASSWORD || '',
          db: 1,
        },
        subscribe: {
          port: env.REDIS_PORT, // Redis port
          host: env.REDIS_HOST, // Redis host
          password: env.REDIS_PASSWORD || '',
          db: 2,
        },
        'node-casbin-official': {
          port: env.REDIS_PORT, // Redis port
          host: env.REDIS_HOST, // Redis host
          password: env.REDIS_PASSWORD || '',
          db: 3,
        },
        'node-casbin-sub': {
          port: env.REDIS_PORT, // Redis port
          host: env.REDIS_HOST, // Redis host
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
        host: env.REDIS_HOST, // default value
        port: env.REDIS_PORT, // default value
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
      endPoint: env.MINIO_HOST,
      port: env.MINIO_PORT ? Number(env.MINIO_PORT) : 9002,
      useSSL: false,
      accessKey: env.MINIO_ACCESS_KEY,
      secretKey: env.MINIO_SECRET_KEY,
      bucketName: env.MINIO_BUCKET_NAME,
    } as MinioConfig,
    bull: {
      defaultQueueOptions: {
        redis: {
          port: env.REDIS_PORT,
          host: env.REDIS_HOST,
          password: env.REDIS_PASSWORD || '',
          db: 4,
        },
      },
    },
    mail: {
      host: env.MAIL_HOST,
      port: env.MAIL_PORT ? Number(env.MAIL_PORT) : 465,
      secure: true,
      auth: {
        user: env.MAIL_USER,
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
        operationIdFactory(_: string, webRouter: RouterOption) {
          return `${webRouter.method}`;
        },
      },
    },
    // 密码重置回调地址
    resetPasswordCallbackUrl: 'http://localhost:5173',
    // 发送给用户邮件中登录地址
    loginUrl: 'http://localhost:5173/user/login',
    // 上传文件后缀名白名单
    upload: {
      whitelist: [...uploadWhiteList, '.xlsx', '.xls'],
    },
    // 创建用户的初始密码
    defaultPassword: '123456',
    autoResetDataBase: env.AUTO_RESET_DATABASE === 'true',
  };
};
