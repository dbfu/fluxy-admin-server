import { ApiProperty } from '@midwayjs/swagger';

export class ApiVO {
  @ApiProperty({ description: '接口url' })
  path: string;

  @ApiProperty({ description: '接口前缀' })
  prefix: string;

  @ApiProperty({ description: '接口名称' })
  title: string;

  @ApiProperty({ description: '接口类型' })
  type: string;

  @ApiProperty({ description: '请求方式' })
  method: string;
}
