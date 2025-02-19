import { ApiProperty, Type } from '@midwayjs/swagger';

export function PageVOWrapper<T>(ResourceCls: Type<T>): Type<PageResultVO<T>> {
  class Page extends PageResultVO<T> {
    @ApiProperty({
      description: '数据',
      type: ResourceCls,
      isArray: true,
    })
    data: T[];
    @ApiProperty({ description: '总条数' })
    total: number;
  }
  return Page;
}

export class PageResultVO<T> {
  data: T[];
  total: number;
}
