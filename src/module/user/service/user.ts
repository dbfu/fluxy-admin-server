import { Inject, Provide } from '@midwayjs/decorator';
import { InjectDataSource, InjectEntityModel } from '@midwayjs/typeorm';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { omit } from 'lodash';

import { BaseService } from '../../../common/base.service';
import { UserEntity } from '../entity/user';
import { R } from '../../../common/base.error.util';
import { UserVO } from '../vo/user';
import { FileService } from '../../file/service/file';
import { FileEntity } from '../../file/entity/file';
import { UserDTO } from '../dto/user';
import { RedisService } from '@midwayjs/redis';
import { MailService } from '../../../common/mail.service';
import { uuid } from '../../../utils/uuid';

@Provide()
export class UserService extends BaseService<UserEntity> {
  @InjectEntityModel(UserEntity)
  userModel: Repository<UserEntity>;
  @InjectEntityModel(FileEntity)
  fileModel: Repository<FileEntity>;
  @Inject()
  fileService: FileService;
  @InjectDataSource()
  defaultDataSource: DataSource;
  @Inject()
  redisService: RedisService;
  @Inject()
  mailService: MailService;

  getModel(): Repository<UserEntity> {
    return this.userModel;
  }

  async createUser(userDTO: UserDTO) {
    const entity = userDTO.toEntity();
    const { userName, phoneNumber, email } = userDTO;

    let isExist = (await this.userModel.countBy({ userName })) > 0;

    if (isExist) {
      throw R.error('当前用户名已存在');
    }

    isExist = (await this.userModel.countBy({ phoneNumber })) > 0;

    if (isExist) {
      throw R.error('当前手机号已存在');
    }

    isExist = (await this.userModel.countBy({ email })) > 0;

    if (isExist) {
      throw R.error('当前邮箱已存在');
    }

    const emailCaptcha = await this.redisService.get(`emailCaptcha:${email}`);

    if (emailCaptcha !== userDTO.emailCaptcha) {
      throw R.error('邮箱验证码错误或已生效');
    }

    // 随机生成密码，并发送到对应的邮箱中。
    const password = uuid();

    // 添加用户，对密码进行加盐加密
    const hashPassword = bcrypt.hashSync(password, 10);

    entity.password = hashPassword;

    // 使用事物
    await this.defaultDataSource.transaction(async manager => {
      await manager.save(UserEntity, entity);

      if (userDTO.avatar) {
        await manager
          .createQueryBuilder()
          .update(FileEntity)
          .set({
            pkValue: entity.id,
            pkName: 'user_avatar',
          })
          .where('id = :id', { id: userDTO.avatar })
          .execute();
      }

      this.mailService.sendMail({
        to: email,
        subject: 'fluxy-admin平台账号创建成功',
        html: `<div>
        <p>${userDTO.nickName}，你的账号已开通成功</p>
        <p>登录地址：<a href="https://fluxyadmin.cn/#/user/login">https://fluxyadmin.cn/#/user/login</a></p>
        <p>登录账号：${userDTO.email}</p>
        <p>登录密码：${password}</p>
        </div>`,
      });
    });

    // 把entity中的password移除返回给前端
    return omit(entity, ['password']) as UserVO;
  }

  async editUser(userDTO: UserDTO): Promise<void | UserVO> {
    const { userName, phoneNumber, email, id, nickName, sex, avatar } = userDTO;
    let user = await this.userModel.findOneBy({ userName });

    if (user && user.id !== id) {
      throw R.error('当前用户名已存在');
    }

    user = await this.userModel.findOneBy({ phoneNumber });

    if (user && user.id !== id) {
      throw R.error('当前手机号已存在');
    }

    user = await this.userModel.findOneBy({ email });

    if (user && user.id !== id) {
      throw R.error('当前邮箱已存在');
    }

    await this.defaultDataSource.transaction(async manager => {
      await manager
        .createQueryBuilder()
        .update(UserEntity)
        .set({
          nickName,
          phoneNumber,
          sex,
        })
        .where('id = :id', { id: userDTO.id })
        .execute();

      const fileRecord = await this.fileModel.findOneBy({
        pkValue: id,
        pkName: 'user_avatar',
      });

      if (fileRecord && !avatar) {
        await this.fileModel.remove(fileRecord);
      } else if (fileRecord && avatar && fileRecord.id !== avatar) {
        await Promise.all([
          manager.delete(FileEntity, fileRecord.id),
          manager
            .createQueryBuilder()
            .update(FileEntity)
            .set({
              pkValue: id,
              pkName: 'user_avatar',
            })
            .where('id = :id', { id: userDTO.avatar })
            .execute(),
        ]);
      } else if (!fileRecord && avatar) {
        manager
          .createQueryBuilder()
          .update(FileEntity)
          .set({
            pkValue: id,
            pkName: 'user_avatar',
          })
          .where('id = :id', { id: userDTO.avatar })
          .execute();
      }
    });

    const entity = this.userModel.findOneBy({ id });
    return omit(entity, ['password']) as UserVO;
  }

  async removeUser(id: number) {
    await this.defaultDataSource.transaction(async manager => {
      const tokens = await this.redisService.smembers(`userToken_${id}`);
      const refreshTokens = await this.redisService.smembers(
        `userRefreshToken_${id}`
      );

      await Promise.all([
        manager
          .createQueryBuilder()
          .delete()
          .from(UserEntity)
          .where('id = :id', { id })
          .execute(),
        manager
          .createQueryBuilder()
          .delete()
          .from(FileEntity)
          .where('pkValue = :pkValue', { pkValue: id })
          .andWhere('pkName = "user_avatar"')
          .execute(),
        ...tokens.map(token => this.redisService.del(`token:${token}`)),
        ...refreshTokens.map(refreshToken =>
          this.redisService.del(`refreshToken:${refreshToken}`)
        ),
      ]);
    });
  }

  async page<T>(page = 0, pageSize = 10, where?: FindOptionsWhere<T>) {
    const [data, total] = await this.userModel
      .createQueryBuilder('t')
      .leftJoinAndMapOne(
        't.avatarEntity',
        FileEntity,
        'file',
        'file.pkValue = t.id and file.pkName = "user_avatar"'
      )
      .where(where)
      .skip(page)
      .take(page * pageSize)
      .orderBy('t.createDate', 'DESC')
      .getManyAndCount();

    return {
      data: data.map(entity => entity.toVO()),
      total,
    };
  }

  async getByEmail(email: string) {
    return await this.userModel.findOneBy({ email });
  }
}
