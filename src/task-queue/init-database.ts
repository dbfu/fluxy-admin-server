import { IProcessor, Processor } from '@midwayjs/bull';
import { App, Config } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as Importer from 'mysql-import';
import * as path from 'path';

@Processor('init-database')
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
      port,
    } = this.typeormConfig.dataSource.default;

    const importer = new Importer({
      host,
      user,
      password,
      database,
      port,
    });

    try {
      console.log('正在初始化数据库数据...');
      await importer.import(path.join(this.app.getBaseDir(), './init.sql'));
      console.log('初始化数据库数据成功');
    } catch (err) {
      console.error(err);
    }
  }
}
