import { Config, Inject, Provide } from '@midwayjs/decorator';
import { InjectDataSource, InjectEntityModel } from '@midwayjs/typeorm';
import { UploadFileInfo } from '@midwayjs/upload';
import { DataSource, Repository } from 'typeorm';
import { MinioClient } from '../../../../autoload/minio';
import { BaseService } from '../../../../common/base-service';
import { MinioConfig } from '../../../../interface';
import { FileEntity } from '../entity/file';

@Provide()
export class FileService extends BaseService<FileEntity> {
  @InjectEntityModel(FileEntity)
  fileModel: Repository<FileEntity>;
  @Inject()
  minioClient: MinioClient;
  @Config('minio')
  minioConfig: MinioConfig;
  @InjectDataSource()
  defaultDataSource: DataSource;

  getModel(): Repository<FileEntity> {
    return this.fileModel;
  }

  // 上传方法
  async upload(file: UploadFileInfo<string>) {
    const fileName = `${new Date().getTime()}_${file.filename}`;

    const data = await this.defaultDataSource.transaction(async manager => {
      const fileEntity = new FileEntity();
      fileEntity.fileName = fileName;
      fileEntity.filePath = `/file/${this.minioConfig.bucketName}/${fileName}`;
      await manager.save(FileEntity, fileEntity);

      await this.minioClient.fPutObject(
        this.minioConfig.bucketName,
        fileName,
        file.data
      );

      return fileEntity;
    });

    return data;
  }

  // 上传单据时，把单据id注入进去
  async setPKValue(id: string, pkValue: string, pkName: string) {
    const entity = await this.getById(id);
    if (!entity) return;
    entity.pkValue = pkValue;
    entity.pkName = pkName;
    await this.fileModel.save(entity);
    return entity;
  }

  // 清理脏数据
  async clearEmptyPKValueFiles() {
    const curDate = new Date();
    curDate.setDate(curDate.getDate() - 1);

    const records = await this.fileModel
      .createQueryBuilder()
      .where('createDate < :date', { date: curDate })
      .andWhere('pkValue is null')
      .getMany();

    this.defaultDataSource.transaction(async manager => {
      await manager.remove(FileEntity, records);
      await Promise.all(
        records.map(record =>
          this.minioClient.removeObject(
            this.minioConfig.bucketName,
            record.fileName
          )
        )
      );
    });
  }
}
