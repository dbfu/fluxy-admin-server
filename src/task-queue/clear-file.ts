import { IProcessor, Processor } from '@midwayjs/bull';
import { Inject } from '@midwayjs/core';
import { FileService } from '../module/system/file/service/file';

@Processor('clear_file', {
  repeat: {
    cron: '0 0 0 * * *',
  },
})
export class ClearFileProcessor implements IProcessor {
  @Inject()
  fileService: FileService;

  async execute() {
    this.fileService.clearEmptyPKValueFiles();
  }
}
