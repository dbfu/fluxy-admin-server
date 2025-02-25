import { ApiProperty } from '@midwayjs/swagger';
import { Rule, RuleType } from '@midwayjs/validate';

export class PageDTO {
  @ApiProperty({ description: '页码', example: 0 })
  @Rule(RuleType.allow(null))
  page: number;
  @ApiProperty({ description: '每页数量', example: 10 })
  @Rule(RuleType.allow(null))
  size: number;
}
