import { ApiProperty } from '@midwayjs/swagger';

export class CaptchaVO {
  @ApiProperty({ description: 'id' })
  id: string;
  @ApiProperty({ description: '验证码图片 base64' })
  imageBase64: string;
}
