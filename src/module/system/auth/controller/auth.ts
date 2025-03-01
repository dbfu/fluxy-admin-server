import {
  Body,
  Config,
  Controller,
  Get,
  Inject,
  Post,
} from '@midwayjs/decorator';
import { RedisService } from '@midwayjs/redis';
import { ApiOkResponse, ApiResponse } from '@midwayjs/swagger';

import { Context } from 'koa';
import { R } from '../../../../common/base-error-util';
import { MailService } from '../../../../common/mail-service';
import { RSAService } from '../../../../common/rsa-service';
import { NotAuth } from '../../../../decorator/not-auth';
import { NotLogin } from '../../../../decorator/not-login';
import { AssertUtils } from '../../../../utils/assert';
import { getAddressByIp, getIp, getUserAgent } from '../../../../utils/utils';
import { uuid } from '../../../../utils/uuid';
import { LoginLogEntity } from '../../login-log/entity/login-log';
import { LoginLogService } from '../../login-log/service/login-log';
import { UserService } from '../../user/service/user';
import { UserVO } from '../../user/vo/user';
import { LoginDTO } from '../dto/login';
import { RefreshTokenDTO } from '../dto/refresh-token';
import { ResetPasswordDTO } from '../dto/reset-password';
import { AuthService } from '../service/auth';
import { CaptchaService } from '../service/captcha';
import { CaptchaVO } from '../vo/captcha';
import { CurrentUserVO } from '../vo/current-user';
import { TokenVO } from '../vo/token';

@Controller('/auth', { description: '权限管理' })
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
  @Inject()
  mailService: MailService;
  @Inject()
  rsaService: RSAService;
  @Inject()
  loginLogService: LoginLogService;
  @Config('resetPasswordCallbackUrl')
  resetPasswordCallbackUrl: string;
  @Config('title')
  title: string;

  @Post('/login', { description: '登录' })
  @ApiResponse({ type: TokenVO })
  @NotLogin()
  async login(@Body() loginDTO: LoginDTO) {
    const ip = getIp(this.ctx);
    const loginLog = new LoginLogEntity();
    loginLog.ip = ip;
    loginLog.address = getAddressByIp(loginLog.ip);
    loginLog.browser = getUserAgent(this.ctx).family;
    loginLog.os = getUserAgent(this.ctx).os.toString();
    loginLog.userName = loginDTO.accountNumber;

    try {
      const password = await this.rsaService.decrypt(
        loginDTO.publicKey,
        loginDTO.password
      );

      AssertUtils.notEmpty(password, '登录出现异常，请重新登录');
      loginDTO.password = password;

      const loginResult = await this.authService.login(loginDTO);

      loginLog.status = true;
      loginLog.message = '成功';
      return loginResult;
    } catch (error) {
      loginLog.status = false;
      loginLog.message = error?.message || '登录失败';

      throw R.error(error.message);
    } finally {
      this.loginLogService.create(loginLog);
    }
  }

  @Post('/refresh/token', { description: '刷新token' })
  @ApiResponse({ type: TokenVO })
  @NotLogin()
  async refreshToken(@Body() data: RefreshTokenDTO) {
    AssertUtils.notEmpty(data.refreshToken, '用户凭证已过期，请重新登录！');

    return this.authService.refreshToken(data);
  }

  @Get('/captcha', { description: '获取验证码' })
  @NotLogin()
  @ApiResponse({ type: CaptchaVO })
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
    return await this.rsaService.getPublicKey();
  }

  @Get('/current/user', { description: '获取当前用户信息' })
  @NotAuth()
  @ApiOkResponse({
    type: CurrentUserVO,
  })
  async getCurrentUser(): Promise<UserVO> {
    return await this.authService.getUserById(this.ctx.userInfo.userId);
  }

  @Post('/logout')
  @NotAuth()
  async logout(): Promise<boolean> {
    // 清除token和refreshToken
    await this.redisService
      .multi()
      .del(`token:${this.ctx.token}`)
      .del(`refreshToken:${this.ctx.userInfo.refreshToken}`)
      .exec();

    return true;
  }

  @NotLogin()
  @NotAuth()
  @Post('/send/reset/password/email')
  async sendResetPasswordEmail(@Body() emailInfo: { checkEmail: string }) {
    if (!emailInfo.checkEmail) {
      throw R.error('邮箱不能为空');
    }

    if (!(await this.userService.getUserByEmail(emailInfo.checkEmail))) {
      throw R.error('系统中不存在当前邮箱');
    }

    const emailCaptcha = uuid();

    await this.redisService.set(
      `resetPasswordEmailCaptcha:${emailInfo.checkEmail}`,
      emailCaptcha,
      'EX',
      60 * 30
    );

    const resetPasswordUrl = `${this.resetPasswordCallbackUrl}/user/reset-password?email=${emailInfo.checkEmail}&emailCaptcha=${emailCaptcha}`;

    this.mailService.sendMail({
      to: emailInfo.checkEmail,
      html: `<div style="padding: 28px 0; color: #888;">
      <h1 style="color: #888;">
        <span style="color:#5867dd; margin:0 1px;"><a>${emailInfo.checkEmail}</a></span>， 你好！
      </h1>
      <p>请先确认本邮件是否是你需要的。</p>
      <p>请点击下面的地址，根据提示进行密码重置：</p>
      <a href="${resetPasswordUrl}" target="_blank" style="text-decoration: none;
      display: inline-block;
      padding: 8px 25px;
      background: #5867dd;
      cursor: pointer;
      color: #fff;
      border-radius: 5px;" rel="noopener">点击跳转到密码重置页面</a>
      <p>如果单击上面按钮没有反应，请复制下面链接到浏览器窗口中，或直接输入链接。</p>
      <p>
        ${resetPasswordUrl}
      </p>
      <p>如您未提交该申请，请不要理会此邮件，对此为您带来的不便深表歉意。</p>
      <p>本次链接30分钟后失效。</p>
      <div style="text-align: right;margin-top: 50px;">
        <span>${this.title}</span>
      </div>
    </div>`,
      subject: `${this.title}平台密码重置提醒`,
    });
  }

  @NotLogin()
  @Post('/reset/password')
  async resetPassword(@Body() resetPasswordDTO: ResetPasswordDTO) {
    await this.authService.resetPassword(resetPasswordDTO);
  }
}
