import { Inject, Provide } from '@midwayjs/decorator';
import { InjectDataSource, InjectEntityModel } from '@midwayjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { DataSource, Repository } from 'typeorm';

import { NodeRedisWatcher } from '@midwayjs/casbin-redis-adapter';
import { RedisService } from '@midwayjs/redis';
import { BaseService } from '../../../common/base.service';
import { MailService } from '../../../common/mail.service';
import { SocketService } from '../../../socket/service';
import { uuid } from '../../../utils/uuid';
import { FileEntity } from '../../file/entity/file';
import { FileService } from '../../file/service/file';
import { RoleEntity } from '../../role/entity/role';
import { UserDTO } from '../dto/user';
import { UserEntity } from '../entity/user';
import { UserRoleEntity } from '../entity/user.role';
import { UserVO } from '../vo/user';
import { EntityRepository, FilterQuery } from '@mikro-orm/mysql';
import { CasbinRule } from '../../../plugins/casbin-mikro-adapter/casbinRule';
import { AssertUtils } from '../../../utils/assert';
import { InjectRepository } from '@midwayjs/mikro';

@Provide()
export class UserService extends BaseService<UserEntity> {
  @InjectRepository(UserEntity)
  userModel: EntityRepository<UserEntity>;
  @InjectRepository(RoleEntity)
  roleModel: EntityRepository<RoleEntity>;
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
  @InjectEntityModel(UserRoleEntity)
  userRoleModel: Repository<UserRoleEntity>;
  @Inject()
  socketService: SocketService;

  @Inject()
  casbinWatcher: NodeRedisWatcher;

  getModel(): EntityRepository<UserEntity> {
    return this.getRepository(UserEntity);
  }

  async createUser(userDTO: UserDTO) {
    const entity = userDTO.toEntity();
    const { userName, phoneNumber, email } = userDTO;

    let isExist = (await this.userModel.count({ userName })) > 0;
    AssertUtils.isTrue(!isExist, '当前用户名已存在');

    isExist = (await this.userModel.count({ phoneNumber })) > 0;
    AssertUtils.isTrue(!isExist, '当前手机号已存在');

    isExist = (await this.userModel.count({ email })) > 0;
    AssertUtils.isTrue(!isExist, '当前邮箱已存在');

    // 随机生成密码，并发送到对应的邮箱中。
    const password = uuid();
    // 添加用户，对密码进行加盐加密
    const hashPassword = bcrypt.hashSync(password, 10);
    entity.password = hashPassword;

    return await this.em.transactional(async em => {
      const user = em.create(UserEntity, entity);

      const roles = await this.roleModel.findAll({
        where: { id: { $in: userDTO.roleIds } },
      });

      roles.forEach(role => {
        user.roles.add(role);
      });

      em.persist(user);

      if (userDTO.avatar) {
        em.createQueryBuilder(FileEntity)
          .update({
            pkValue: user.id,
            pkName: 'user_avatar',
          })
          .andWhere({ id: userDTO.avatar })
          .execute();
      }

      // 构造策略对象
      userDTO.roleIds.forEach(roleId => {
        const casbinRule = new CasbinRule();
        casbinRule.ptype = 'g';
        casbinRule.v0 = userDTO.id;
        casbinRule.v1 = roleId;
        em.persist(casbinRule);
      });

      // await this.mailService.sendMail({
      //   to: email,
      //   subject: 'fluxy-admin平台账号创建成功',
      //   html: `<div>
      //   <p><span style="color:#5867dd;">${userDTO.nickName}</span>，你的账号已开通成功</p>
      //   <p>登录地址：<a href="https://fluxyadmin.cn/user/login">https://fluxyadmin.cn/user/login</a></p>
      //   <p>登录账号：${userDTO.email}</p>
      //   <p>登录密码：${password}</p>
      //   </div>`,
      // });

      await em.flush();

      // 发消息给其它进程，同步最新的策略
      await this.casbinWatcher.publishData();

      // 把entity中的password移除返回给前端
      return user.toVO();
    });
  }

  /**
   * 编辑用户信息
   *
   * @param userDTO 用户DTO对象
   * @returns 返回更新后的用户信息
   */
  async updateUser(userDTO: UserDTO): Promise<UserVO> {
    const { userName, phoneNumber, email, id, nickName, sex } = userDTO;

    const user = await this.repo(UserEntity).findOne({ id });

    AssertUtils.notEmpty(user, '当前用户不存在');

    let isExist =
      (await this.repo(UserEntity).count({
        userName,
        id: { $ne: id },
      })) > 0;

    AssertUtils.isTrue(!isExist, '当前用户名已存在');

    isExist =
      (await this.repo(UserEntity).count({
        phoneNumber,
        id: { $ne: id },
      })) > 0;

    AssertUtils.isTrue(!isExist, '当前手机号已存在');

    isExist =
      (await this.repo(UserEntity).count({
        email,
        id: { $ne: id },
      })) > 0;

    AssertUtils.isTrue(!isExist, '当前邮箱已存在');

    const data = await this.em.transactional(async em => {
      const casbinRules = await this.repo(CasbinRule).findAll({
        where: { v0: userDTO.id, ptype: 'g' },
      });

      em.remove(casbinRules);

      userDTO.roleIds.forEach(roleId => {
        const casbinRule = new CasbinRule();
        casbinRule.ptype = 'g';
        casbinRule.v0 = userDTO.id;
        casbinRule.v1 = roleId;
        em.persist(casbinRule);
      });

      const roles = await this.repo(RoleEntity).findAll({
        where: { id: { $in: userDTO.roleIds } },
      });

      user.nickName = nickName;
      user.phoneNumber = phoneNumber;
      user.sex = sex;
      user.avatar = em.getReference(FileEntity, userDTO.avatar);

      user.roles.removeAll();
      roles.forEach(role => {
        user.roles.add(role);
      });

      await em.flush();

      return user.toVO();
    });

    // 发消息给其它进程，同步最新的策略
    await this.casbinWatcher.publishData();

    return data;
  }

  async removeUser(id: string) {
    await this.em.transactional(async () => {
      const tokens = await this.redisService.smembers(`userToken_${id}`);
      const refreshTokens = await this.redisService.smembers(
        `userRefreshToken_${id}`
      );

      await Promise.all([
        this.userModel.createQueryBuilder().delete().where({ id }).execute(),
        this.repo(FileEntity)
          .createQueryBuilder()
          .delete()
          .where({
            pkValue: id,
            pkName: 'user_avatar',
          })
          .execute(),
        ...tokens.map(token => this.redisService.del(`token:${token}`)),
        ...refreshTokens.map(refreshToken =>
          this.redisService.del(`refreshToken:${refreshToken}`)
        ),
      ]);
    });

    await this.casbinWatcher.publishData();
  }

  async page(page = 0, pageSize = 10, where?: FilterQuery<UserEntity>) {
    const [data, total] = await this.userModel.findAndCount(where, {
      orderBy: { createDate: 'DESC' },
      limit: pageSize,
      offset: page * pageSize,
      populate: ['roles', 'avatar'],
    });

    return {
      data: data.map(entity => entity.toVO()),
      total,
    };
  }

  async getByEmail() {
    // return await this.userModel.findOneBy({ email });
    return null;
  }

  async getRoleIdsByUserId(userId: string) {
    console.log(userId);
    // const query = this.userModel.createQueryBuilder('t');

    // const user = (await query
    //   .where('t.id = :id', { id: userId })
    //   .leftJoinAndSelect(UserRoleEntity, 'userRole', 't.id = userRole.userId')
    //   .leftJoinAndMapMany(
    //     't.roles',
    //     RoleEntity,
    //     'role',
    //     'role.id = userRole.roleId'
    //   )
    //   .getOne()) as unknown as any;

    // return user?.roles?.map(o => o.id) || [];

    return [];
  }
}
