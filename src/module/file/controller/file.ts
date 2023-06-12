import {
  Controller,
  Inject,
  Post,
  Provide,
  Files,
  Fields,
} from '@midwayjs/core';
import { FileService } from '../service/file';
import { NotLogin } from '../../../decorator/not.login';
import { ApiBody } from '@midwayjs/swagger';
import { FileDTO } from '../dto/file';

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
