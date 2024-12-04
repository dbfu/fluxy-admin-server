import { IMidwayContainer } from '@midwayjs/core';
import { MikroORMAdapter } from './adapter';
import { TypeORMAdapterConfig } from './interface';
import { MikroDataSourceManager } from '@midwayjs/mikro';
import { EntityManager } from '@mikro-orm/mysql';

export * from './adapter';
export * from './casbinRule';

export function createAdapter(options: TypeORMAdapterConfig) {
  return async (container: IMidwayContainer) => {
    const typeORMDataSourceManager = await container.getAsync(
      MikroDataSourceManager
    );
    const dataSource = typeORMDataSourceManager.getDataSource(
      options.dataSourceName
    );
    return new MikroORMAdapter(dataSource.em as EntityManager);
  };
}
