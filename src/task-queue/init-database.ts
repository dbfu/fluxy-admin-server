import { IProcessor, Processor } from '@midwayjs/bull';
import { App, Config } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as Importer from 'mysql-import';
import * as path from 'path';

@Processor('init-database', {
  repeat: {
    cron: '0 0 0 * * *',
  },
})
export class InitDatabaseProcessor implements IProcessor {
  @Config('typeorm')
  typeormConfig: any;
  @App()
  app: koa.Application;

  async execute() {
    const {
      host,
      password,
      database,
      username: user,
    } = this.typeormConfig.dataSource.default;

    const importer = new Importer({
      host,
      user,
      password,
      database,
    });

    try {
      await importer.import(path.join(this.app.getBaseDir(), './init.sql'));
      const files_imported = importer.getImported();
      console.log(`${files_imported.length} SQL file(s) imported.`);
    } catch (err) {
      console.error(err);
    }
  }
}
