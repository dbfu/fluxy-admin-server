import { Controller, Files, Inject, Post } from '@midwayjs/core';
import { ApiBody, ApiExcludeController } from '@midwayjs/swagger';
import { NotLogin } from '../../../../decorator/not-login';
import { FileService } from '../service/file';

@Controller('/file')
@ApiExcludeController()
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
