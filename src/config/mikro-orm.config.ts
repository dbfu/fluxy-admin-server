import { Migrator } from '@mikro-orm/migrations';
import { defineConfig, MySqlDriver } from '@mikro-orm/mysql';
import { CasbinRule } from '../plugins/casbin-mikro-adapter';

export default defineConfig({
  entities: ['**/module/**/entity/*.{j,t}s', CasbinRule],
  dbName: 'fluxy-admin1',
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '12345678',
  driver: MySqlDriver, // 这里使用了 sqlite 做示例
  debug: true,
  extensions: [Migrator],
  allowGlobalContext: true,
});
