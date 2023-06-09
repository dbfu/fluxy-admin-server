import { Rule, RuleType } from '@midwayjs/validate';
import { ApiProperty } from '@midwayjs/swagger';

export class RefreshTokenDTO {
  @ApiProperty({
    description: '刷新token',
  })
  @Rule(RuleType.allow(null))
  refreshToken?: string;
}
