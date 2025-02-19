import { ApiProperty } from '@midwayjs/swagger';

export class TokenVO {
  @ApiProperty({ description: 'token的过期时间' })
  expire: number;
  @ApiProperty({ description: 'token' })
  token: string;
  @ApiProperty({ description: '刷新token的过期时间' })
  refreshExpire: number;
  @ApiProperty({ description: '刷新token' })
  refreshToken: string;
}
