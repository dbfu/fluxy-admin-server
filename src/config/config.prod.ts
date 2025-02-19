import { MidwayConfig } from '@midwayjs/core';
import * as redisStore from 'cache-manager-ioredis';
import { env } from 'process';

import { MailConfig, MinioConfig, TokenConfig } from '../interface';

import { EverythingSubscriber } from '../typeorm-event-subscriber';
import typeormConfig from './typeorm.prod';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1684629293601_5943',
  koa: {
    port: 7001,
    globalPrefix: '/api',
  },
  typeorm: typeormConfig.typeorm,
  redis: {
    client: {
      port: 6379, // Redis port
      host: env.REDIS_HOST, // Redis host
      password: env.REDIS_PASSWORD || '',
      db: 0,
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
        port: 6379,
        host: env.REDIS_HOST,
        password: env.REDIS_PASSWORD || '',
      },
    },
  },
  mail: {
    host: env.MAIL_HOST || 'smtp.qq.com',
    port: env.MAIL_PORT ? Number(env.MAIL_PORT) : 465,
    secure: true,
    auth: {
      user: env.MAIL_USER,
      pass: env.MAIL_PASS,
    },
  } as MailConfig,
  subscribers: [EverythingSubscriber],
} as MidwayConfig;
