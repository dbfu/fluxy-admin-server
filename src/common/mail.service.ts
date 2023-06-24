import { Config, Provide, Singleton } from '@midwayjs/core';
import * as nodemailer from 'nodemailer';
import { MailConfig } from '../interface';

interface MailInfo {
  // 目标邮箱
  to: string;
  // 标题
  subject: string;
  // 文本
  text?: string;
  // 富文本，如果文本和富文本同时设置，富文本生效。
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

    return info;
  }
}
