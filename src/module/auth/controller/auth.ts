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
import { Context } from '@midwayjs/core';

import { AuthService } from '../service/auth';
import { TokenVO } from '../vo/token';
import { LoginDTO } from '../dto/login';
import { CaptchaService } from '../service/captcha';
import { R } from '../../../common/base.error.util';
import { UserService } from '../../user/service/user';
import { NotLogin } from '../../../decorator/not.login';
import { UserVO } from '../../user/vo/user';
import { RefreshTokenDTO } from '../dto/refresh.token';
import { sendMail } from '../../../utils/mailer';
@Provide()
@Controller('/auth')
export class AuthController {
  @Inject()
  authService: AuthService;
  @Inject()
  captchaService: CaptchaService;
  @Inject()
  redisService: RedisService;
  @Inject()
  userService: UserService;
  @Inject()
  ctx: Context;

  @Post('/login', { description: '登录' })
  @ApiResponse({ type: TokenVO })
  @NotLogin()
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

  @Post('/refresh/token', { description: '刷新token' })
  @NotLogin()
  async refreshToken(@Body(ALL) data: RefreshTokenDTO) {
    if (!data.refreshToken) {
      throw R.error('用户凭证已过期，请重新登录！');
    }
    return this.authService.refreshToken(data);
  }

  @Get('/captcha')
  @NotLogin()
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
  @NotLogin()
  async getPublicKey() {
    const key = new NodeRSA({ b: 512 });
    const publicKey = key.exportKey('public');
    const privateKey = key.exportKey('private');
    await this.redisService.set(`publicKey:${publicKey}`, privateKey);
    return publicKey;
  }

  @Get('/current/user')
  async getCurrentUser(): Promise<UserVO> {
    sendMail();
    return await this.authService.getUserById(this.ctx.userInfo.userId);
  }

  @Post('/logout')
  async logout(): Promise<boolean> {
    // 清除token和refreshToken
    const res = await this.redisService
      .multi()
      .del(`token:${this.ctx.token}`)
      .del(`refreshToken:${this.ctx.userInfo.refreshToken}`)
      .exec();

    if (res.some(item => item[0])) {
      throw R.error('退出登录失败');
    }

    return true;
  }
}
