import { ApiProperty } from '@midwayjs/swagger';
import { Rule } from '@midwayjs/validate';
import { requiredNumber } from './common.validate.rules';

export class PageDTO {
  @ApiProperty({ description: 'page', example: '0' })
  @Rule(requiredNumber)
  page: number;
  @ApiProperty({ description: 'pageSize', example: '0' })
  @Rule(requiredNumber)
  size: number;
}
