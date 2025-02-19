import { ApiProperty } from '@midwayjs/swagger';
import { Rule } from '@midwayjs/validate';
import { requiredNumber } from './common-validate-rules';

export class PageDTO {
  @ApiProperty({ description: '页码', example: 0 })
  @Rule(requiredNumber)
  page: number;
  @ApiProperty({ description: '每页数量', example: 10 })
  @Rule(requiredNumber)
  size: number;
}
