import { CasbinRule } from '@midwayjs/casbin-typeorm-adapter';
import { MidwayConfig } from '@midwayjs/core';
import { env } from 'process';
import { EverythingSubscriber } from '../typeorm-event-subscriber';

export default {
  typeorm: {
    dataSource: {
      default: {
        type: 'mysql',
        host: env.DB_HOST,
        port: env.DB_PORT ? Number(env.DB_PORT) : 3306,
        username: env.DB_USERNAME,
        password: env.DB_PASSWORD,
        database: env.DB_NAME,
        synchronize: false,
        logging: false,
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
  // 密码重置回调地址
  resetPasswordCallbackUrl: 'https://dev.fluxyadmin.cn/',
  // 发送给用户邮件中登录地址
  loginUrl: 'https://dev.fluxyadmin.cn/user/login',
} as MidwayConfig;
