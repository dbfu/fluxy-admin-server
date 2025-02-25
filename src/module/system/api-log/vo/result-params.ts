import { ApiProperty } from '@midwayjs/swagger';

export class ResultParamsVO {
  @ApiProperty({ description: 'id' })
  id?: string;

  @ApiProperty({ description: 'result参数' })
  result?: string;
}
