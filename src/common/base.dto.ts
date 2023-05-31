import { ApiProperty } from '@midwayjs/swagger';
import { Rule, RuleType } from '@midwayjs/validate';

export class BaseDTO<T> {
  @ApiProperty()
  @Rule(RuleType.allow(null))
  id: number;
  toEntity(): T {
    return this as unknown as T;
  }
}
