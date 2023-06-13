import { Processor, IProcessor } from '@midwayjs/bull';
import { Inject } from '@midwayjs/core';
import { FileService } from '../module/file/service/file';

@Processor('test', {
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
