import { env } from 'process';

export default {
  typeorm: {
    dataSource: {
      default: {
        type: 'mysql',
        host: env.DB_HOST,
        port: env.DB_PORT || 3306,
        username: env.DB_USERNAME,
        password: env.DB_PASSWORD,
        database: env.DB_NAME || 'fluxy-admin',
        synchronize: false,
        logging: false,
        // 扫描entity文件夹
        entities: ['**/entity/*{.ts,.js}'],
        timezone: '+00:00',
        // 迁移存在的文件路径
        migrations: ['**/migration/*.ts'],
        // 迁移存在的文件夹路径
        cli: {
          migrationsDir: 'migration',
        },
      },
    },
  },
};
