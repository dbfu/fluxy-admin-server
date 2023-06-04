import {
  Body,
  Controller,
  Inject,
  Post,
  Provide,
  ALL,
  Get,
} from '@midwayjs/decorator';
import { ApiResponse } from '@midwayjs/swagger';
import * as NodeRSA from 'node-rsa';
import { RedisService } from '@midwayjs/redis';

import { AuthService } from '../service/auth';
import { TokenVO } from '../vo/token';
import { LoginDTO } from '../dto/login';
import { CaptchaService } from '../service/captcha';
import { R } from '../../../common/base.error.util';
@Provide()
@Controller('/auth')
export class AuthController {
  @Inject()
  authService: AuthService;
  @Inject()
  captchaService: CaptchaService;
  @Inject()
  redisService: RedisService;

  @Post('/login', { description: '登录' })
  @ApiResponse({ type: TokenVO })
  async login(@Body(ALL) loginDTO: LoginDTO) {
    const { captcha, captchaId } = loginDTO;

    const result = await this.captchaService.check(captchaId, captcha);

    if (!result) {
      throw R.error('验证码错误');
    }

    const privateKey = await this.redisService.get(
      `publicKey:${loginDTO.publicKey}`
    );

    await this.redisService.del(`publicKey:${loginDTO.publicKey}`);

    if (!privateKey) {
      throw R.error('登录出现异常，请重新登录');
    }

    // 解密
    const decrypt = new NodeRSA(privateKey);
    decrypt.setOptions({ encryptionScheme: 'pkcs1' });
    const password = decrypt.decrypt(loginDTO.password, 'utf8');

    if (!password) {
      throw R.error('登录出现异常，请重新登录');
    }

    loginDTO.password = password;

    return await this.authService.login(loginDTO);
  }

  @Get('/captcha')
  async getImageCaptcha() {
    const { id, imageBase64 } = await this.captchaService.formula({
      height: 40,
      width: 120,
      noise: 1,
      color: true,
    });
    return {
      id,
      imageBase64,
    };
  }

  @Get('/publicKey')
  async getPublicKey() {
    const key = new NodeRSA({ b: 512 });
    const publicKey = key.exportKey('public');
    const privateKey = key.exportKey('private');
    await this.redisService.set(`publicKey:${publicKey}`, privateKey);
    return publicKey;
  }
}
