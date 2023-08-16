import { env } from 'process';
import { CasbinRule } from '@midwayjs/casbin-typeorm-adapter';

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
        entities: ['**/entity/*{.ts,.js}', CasbinRule],
        timezone: '+00:00',
        migrations: ['**/migration/*.ts'],
        cli: {
          migrationsDir: 'migration',
        },
      },
    },
  },
};
