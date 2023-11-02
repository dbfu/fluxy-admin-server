import {
  Controller,
  Fields,
  Files,
  Inject,
  Post,
  Provide,
} from '@midwayjs/core';
import { ApiBody } from '@midwayjs/swagger';
import { NotLogin } from '../../../decorator/not.login';
import { FileDTO } from '../dto/file';
import { FileService } from '../service/file';

@Provide()
@Controller('/file')
export class FileController {
  @Inject()
  fileService: FileService;
  @Inject()
  minioClient;

  @Post('/upload')
  @ApiBody({ description: 'file' })
  @ApiBody({ description: 'fields', type: FileDTO })
  @NotLogin()
  async upload(@Files() files, @Fields() fields) {
    if (files.length) {
      return await this.fileService.upload(files[0], fields);
    }
    return {};
  }
}
