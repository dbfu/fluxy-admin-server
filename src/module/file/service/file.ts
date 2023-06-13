import { Config, Inject, Provide } from '@midwayjs/decorator';
import { InjectDataSource, InjectEntityModel } from '@midwayjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BaseService } from '../../../common/base.service';
import { FileEntity } from '../entity/file';
import { UploadFileInfo } from '@midwayjs/upload';
import { MinioClient } from '../../../autoload/minio';
import { MinioConfig } from '../../../interface';

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

  async setPKValue(id: number, pkValue: number, pkName: string) {
    const entity = await this.getById(id);
    if (!entity) return;
    entity.pkValue = pkValue;
    entity.pkName = pkName;
    await this.fileModel.save(entity);
    return entity;
  }

  async clearEmptyPKValueFiles() {
    const curDate = new Date();
    curDate.setDate(curDate.getDate() - 1);

    await this.fileModel
      .createQueryBuilder()
      .where('createDate < :date', { date: curDate })
      .andWhere('pkValue is null')
      .delete()
      .execute();
  }
}
