import { MidwayConfig } from '@midwayjs/core';
import * as redisStore from 'cache-manager-ioredis';
import { TokenConfig } from '../interface/token.config';
import { env } from 'process';
import { MinioConfig } from '../interface';

export default {
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
        host: env.DB_HOST || 'localhost', // 数据库ip地址，本地就写localhost
        port: 3306,
        username: env.DB_USERNAME || 'root',
        password: env.DB_PASSWORD || '12345678',
        database: 'fluxy-admin', // 数据库名称
        synchronize: true, // 如果第一次使用，不存在表，有同步的需求可以写 true，注意会丢数据
        logging: true,
        // 扫描entity文件夹
        entities: ['**/entity/*{.ts,.js}'],
        timezone: '+00:00',
      },
    },
  },
  redis: {
    client: {
      port: 6379, // Redis port
      host: env.REDIS_HOST || 'localhost', // Redis host
      password: env.REDIS_PASSWORD || '',
      db: 0,
    },
  },
  i18n: {
    // 把你的翻译文本放到这里
    localeTable: {
      en_US: require('../locales/en_US'),
      zh_CN: require('../locales/zh_CN'),
    },
    defaultLocale: 'zh_CN',
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
    endPoint: 'localhost',
    port: 9002,
    useSSL: false,
    accessKey: 'root',
    secretKey: '12345678',
    bucketName: 'fluxy-admin',
  } as MinioConfig,
} as MidwayConfig;
