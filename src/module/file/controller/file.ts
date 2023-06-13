import { Controller, Inject, Post, Provide, Files } from '@midwayjs/core';
import { FileService } from '../service/file';
import { NotLogin } from '../../../decorator/not.login';
import { ApiBody } from '@midwayjs/swagger';

@Provide()
@Controller('/file')
export class FileController {
  @Inject()
  fileService: FileService;
  @Inject()
  minioClient;

  @Post('/upload')
  @ApiBody({ description: 'file' })
  @NotLogin()
  async upload(@Files() files) {
    if (files.length) {
      return await this.fileService.upload(files[0]);
    }
    return {};
  }
}
