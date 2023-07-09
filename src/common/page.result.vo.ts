import { ApiProperty, getSchemaPath, Type } from '@midwayjs/swagger';

export function PageResult<T extends Type>(ResourceCls: T) {
  class Page extends PageResultVO<T> {
    @ApiProperty({ description: '页数' })
    page: number;
    @ApiProperty({ description: '每页数量' })
    pageSize: number;
    @ApiProperty({
      description: '数据',
      type: 'array',
      items: {
        $ref: getSchemaPath(ResourceCls),
      },
    })
    data: T[];
    @ApiProperty({ description: '总条数' })
    total: number;
  }
  return Page;
}

export class PageResultVO<T> {
  page: number;
  size: number;
  data: T[];
  total: number;
}
