import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Provide,
  Query,
  ALL,
  Put,
  Param,
  Del,
} from '@midwayjs/decorator';
import { UserDTO } from '../dto/user';
import { UserService } from '../service/user';
import { FindOptionsWhere, Like } from 'typeorm';
import { UserEntity } from '../entity/user';
import { FileService } from '../../file/service/file';
import { RuleType, Valid } from '@midwayjs/validate';
import { R } from '../../../common/base.error.util';
import { MailService } from '../../../common/mail.service';
import { generateRandomCode } from '../../../utils/uuid';
import { RedisService } from '@midwayjs/redis';

@Provide()
@Controller('/user')
export class UserController {
  @Inject()
  userService: UserService;
  @Inject()
  fileService: FileService;
  @Inject()
  mailService: MailService;
  @Inject()
  redisService: RedisService;

  @Post('/', { description: '新建' })
  async create(@Body(ALL) data: UserDTO) {
    if (!data.emailCaptcha) {
      throw R.error('邮箱验证码不能为空');
    }
    return await this.userService.createUser(data);
  }

  @Put('/', { description: '编辑' })
  async edit(@Body(ALL) data: UserDTO) {
    return await this.userService.editUser(data);
  }

  @Del('/:id', { description: '删除' })
  async remove(
    @Valid(RuleType.number().required().error(R.error('id不能为空')))
    @Param('id')
    id: number
  ) {
    await this.userService.removeUser(id);
  }

  @Get('/:id', { description: '根据id查询' })
  async getById(
    @Param('id')
    id: number
  ) {
    return await this.userService.getById(id);
  }

  @Get('/page', { description: '分页查询' })
  async page(
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('nickName') nickName: string,
    @Query('phoneNumber') phoneNumber: string
  ) {
    const query: FindOptionsWhere<UserEntity> = {};

    if (phoneNumber) {
      query.phoneNumber = Like(`%${phoneNumber}%`);
    }

    if (nickName) {
      query.nickName = Like(`%${nickName}%`);
    }

    return await this.userService.page(page, size, query);
  }

  @Post('/send/email/captcha')
  async sendEmailCaptcha(@Body() email: { email: string }) {
    const emailCaptcha = generateRandomCode();

    await this.redisService.set(
      `emailCaptcha:${email.email}`,
      emailCaptcha,
      'EX',
      60 * 30
    );

    this.mailService.sendMail({
      to: email.email,
      html: `<div>
        您本次的验证码是<span style="color:#5867dd;font-weight:800;font-size:24px;">${emailCaptcha}</span>，验证码有效期为30分钟。
      </div`,
      subject: 'fluxy-admin平台邮箱校验提醒',
    });
  }
}
