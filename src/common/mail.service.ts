import { Config, Provide, Singleton } from '@midwayjs/core';
import * as nodemailer from 'nodemailer';
import { MailConfig } from '../interface';

interface MailInfo {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

@Provide()
@Singleton()
export class MailService {
  @Config('mail')
  mailConfig: MailConfig;

  async sendMail(mailInfo: MailInfo) {
    const transporter = nodemailer.createTransport(this.mailConfig);

    // 定义transport对象并发送邮件
    const info = await transporter.sendMail({
      from: this.mailConfig.auth.user, // 发送方邮箱的账号
      ...mailInfo,
    });

    console.log(info);

    return info;
  }
}
