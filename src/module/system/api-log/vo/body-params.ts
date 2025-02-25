import { ApiProperty } from '@midwayjs/swagger';

export class BodyParamsVO {
  @ApiProperty({ description: 'id' })
  id?: string;

  @ApiProperty({ description: 'body参数' })
  body?: string;
}
