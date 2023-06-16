import { env } from 'process';

export default {
  typeorm: {
    dataSource: {
      default: {
        type: 'mysql',
        host: env.DB_HOST || 'localhost',
        port: 3306,
        username: env.DB_USERNAME || 'root',
        password: env.DB_PASSWORD || '12345678',
        database: env.DB_NAME || 'fluxy-admin',
        synchronize: false,
        logging: false,
        // 扫描entity文件夹
        entities: ['**/entity/*{.ts,.js}'],
        timezone: '+00:00',
        migrations: ['**/migration/*.ts'],
        cli: {
          migrationsDir: 'migration',
        },
      },
    },
  },
};
