import { Config, IMidwayContainer, Singleton } from '@midwayjs/core';
import { ApplicationContext, Autoload, Init } from '@midwayjs/decorator';
import * as Minio from 'minio';

import { MinioConfig } from '../interface';

export type MinioClient = Minio.Client;

@Autoload()
@Singleton()
export class MinioAutoLoad {
  @ApplicationContext()
  applicationContext: IMidwayContainer;
  @Config('minio')
  minioConfig: MinioConfig;
  @Init()
  async init() {
    const minioClient = new Minio.Client(this.minioConfig);
    this.applicationContext.registerObject('minioClient', minioClient);
  }
}
