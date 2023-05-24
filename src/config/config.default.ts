import { MidwayConfig } from '@midwayjs/core';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1684629293601_5943',
  koa: {
    port: 7001,
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
        database: 'test', // 数据库名称
        synchronize: true, // 如果第一次使用，不存在表，有同步的需求可以写 true，注意会丢数据
        logging: true,
        // 扫描entity文件夹
        entities: ['**/entity/*{.ts,.js}'],
      },
    },
  },
  redis: {
    client: {
      port: 6379, // Redis port
      host: 'localhost', // Redis host
      password: '123456',
      db: 0,
    },
  },
  i18n: {
    // 把你的翻译文本放到这里
    localeTable: {
      en_US: require('../locales/en_US'),
      zh_CN: require('../locales/zh_CN'),
    },
    defaultLocale: 'en_US',
  },
} as MidwayConfig;
