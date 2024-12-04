import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Provide,
  Query,
  Put,
  Param,
  Del,
} from '@midwayjs/decorator';
import { UserDTO } from '../dto/user';
import { UserService } from '../service/user';
import { UserEntity } from '../entity/user';
import { FileService } from '../../file/service/file';
import { RuleType, Valid } from '@midwayjs/validate';
import { R } from '../../../common/base.error.util';
import { MailService } from '../../../common/mail.service';
import { generateRandomCode } from '../../../utils/uuid';
import { RedisService } from '@midwayjs/redis';
import { FilterParams } from '../../../utils/filter-query';

@Provide()
@Controller('/user', { description: '用户管理' })
export class UserController {
  @Inject()
  userService: UserService;
  @Inject()
  fileService: FileService;
  @Inject()
  mailService: MailService;
  @Inject()
  redisService: RedisService;

  @Get('/page', { description: '分页查询用户' })
  async page(
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('nickName') nickName: string,
    @Query('phoneNumber') phoneNumber: string,
    @Query('userName') userName: string
  ) {
    const query = new FilterParams<UserEntity>();

    query
      .append('phoneNumber', { $like: `%${phoneNumber}%` }, !!phoneNumber)
      .append('userName', { $like: `%${userName}%` }, !!userName)
      .append('nickName', { $like: `%${nickName}%` }, !!nickName);

    return await this.userService.page(page, size, query.where);
  }

  @Post('/', { description: '创建用户' })
  async create(@Body() data: UserDTO) {
    return await this.userService.createUser(data);
  }

  @Put('/', { description: '更新用户' })
  async edit(@Body() data: UserDTO) {
    return await this.userService.updateUser(data);
  }

  @Del('/:id', { description: '删除用户' })
  async remove(
    @Valid(RuleType.number().required().error(R.error('id不能为空')))
    @Param('id')
    id: string
  ) {
    await this.userService.removeUser(id);
  }

  @Get('/:id', { description: '根据id查询用户' })
  async getById(
    @Param('id')
    id: string
  ) {
    return await this.userService.getById(id);
  }

  @Post('/send/email/captcha', { description: '发送邮箱验证码' })
  async sendEmailCaptcha(@Body() emailInfo: { email: string }) {
    if (!emailInfo.email) {
      throw R.error('邮箱不能为空');
    }

    // 生成随机4位数
    const emailCaptcha = generateRandomCode();
    // 把生成的随机数存到redis中，后面添加用户的时候需要做验证
    await this.redisService.set(
      `emailCaptcha:${emailInfo.email}`,
      emailCaptcha,
      'EX',
      60 * 30 // 30分钟
    );

    // 这里邮件内容支持html，后面会做一个在线自定义邮件模版功能，就不用写死在代码里了。
    this.mailService.sendMail({
      to: emailInfo.email,
      html: `<div>
        您本次的验证码是<span style="color:#5867dd;font-weight:800;font-size:24px;">${emailCaptcha}</span>，验证码有效期为30分钟。
      </div`,
      subject: 'fluxy-admin平台邮箱校验提醒',
    });
  }
}
