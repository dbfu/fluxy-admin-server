import { ApiProperty } from '@midwayjs/swagger';
import { Rule } from '@midwayjs/validate';
import { R } from '../../../common/base.error.util';
import { email, requiredString } from '../../../common/common.validate.rules';

export class ResetPasswordDTO {
  @ApiProperty({ description: '密码' })
  @Rule(requiredString.error(R.validateError('密码不能为空')))
  password: string;
  @ApiProperty({ description: '邮箱' })
  @Rule(email.error(R.validateError('无效的邮箱格式')))
  email: string;
  @ApiProperty({ description: '邮箱验证码' })
  emailCaptcha: string;
  @Rule(requiredString.error(R.validateError('公钥不能为空')))
  publicKey: string;
}
