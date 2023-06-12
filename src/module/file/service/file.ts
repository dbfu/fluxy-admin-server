import { Config, Inject, Provide } from '@midwayjs/decorator';
import { InjectDataSource, InjectEntityModel } from '@midwayjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BaseService } from '../../../common/base.service';
import { FileEntity } from '../entity/file';
import { UploadFileInfo } from '@midwayjs/upload';
import { MinioClient } from '../../../autoload/minio';
import { MinioConfig } from '../../../interface';
import { FileDTO } from '../dto/file';

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

  async upload(file: UploadFileInfo<string>, fields: FileDTO) {
    const fileName = `${new Date().getTime()}_${file.filename}`;

    const data = await this.defaultDataSource.transaction(async manager => {
      const fileEntity = new FileEntity();
      fileEntity.fileName = fileName;
      fileEntity.filePath = `/file/${this.minioConfig.bucketName}/${fileName}`;
      fileEntity.pkName = fields.pkName;
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

  async setPKValue(id: number, pkValue: number) {
    const entity = await this.getById(id);
    entity.pkValue = pkValue;
    await this.fileModel.save(entity);
    return entity;
  }
}
