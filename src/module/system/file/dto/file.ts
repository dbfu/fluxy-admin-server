import { ApiProperty } from '@midwayjs/swagger';
import { Rule } from '@midwayjs/validate';
import { BaseDTO } from '../../../../common/base-dto';
import { R } from '../../../../common/base-error-util';
import { requiredString } from '../../../../common/common-validate-rules';
import { FileEntity } from '../entity/file';

export class FileDTO extends BaseDTO<FileEntity> {
  @ApiProperty({
    description: 'pkName',
  })
  @Rule(requiredString.error(R.validateError('pkName不能为空')))
  pkName: string;
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: '文件',
  })
  file: any;
}
