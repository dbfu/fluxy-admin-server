import { ApiProperty } from '@midwayjs/swagger';

export class QueryParamsVO {
  @ApiProperty({ description: 'id' })
  id?: string;

  @ApiProperty({ description: 'query参数' })
  query?: string;
}
