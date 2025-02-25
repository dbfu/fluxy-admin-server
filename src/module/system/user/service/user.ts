import { Config, Inject, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Not, Repository } from 'typeorm';

import { CasbinEnforcerService } from '@midwayjs/casbin';
import { NodeRedisWatcher } from '@midwayjs/casbin-redis-adapter';
import { CasbinRule } from '@midwayjs/casbin-typeorm-adapter';
import { RedisService } from '@midwayjs/redis';
import { BaseService } from '../../../../common/base-service';
import { MailService } from '../../../../common/mail-service';
import { AssertUtils } from '../../../../utils/assert';
import { FilterQuery } from '../../../../utils/filter-query';
import { like } from '../../../../utils/typeorm-utils';
import { FileEntity } from '../../file/entity/file';
import { FileService } from '../../file/service/file';
import { RoleEntity } from '../../role/entity/role';
import { SocketService } from '../../socket/service/socket';
import { SocketMessageType } from '../../socket/type';
import { UserDTO } from '../dto/user';
import { UserPageDTO } from '../dto/user-page';
import { UserEntity } from '../entity/user';
import { UserRoleEntity } from '../entity/user-role';
import { UserVO } from '../vo/user';
import { UserPageVO } from '../vo/user-page';

@Provide()
export class UserService extends BaseService<UserEntity> {
  @InjectEntityModel(UserEntity)
  userModel: Repository<UserEntity>;
  @InjectEntityModel(FileEntity)
  fileModel: Repository<FileEntity>;
  @Inject()
  fileService: FileService;
  @Inject()
  redisService: RedisService;
  @Inject()
  mailService: MailService;
  @InjectEntityModel(UserRoleEntity)
  userRoleModel: Repository<UserRoleEntity>;
  @Inject()
  socketService: SocketService;
  @Inject()
  casbinEnforcerService: CasbinEnforcerService;
  @Inject()
  casbinWatcher: NodeRedisWatcher;
  @Config('title')
  title: string;
  @Config('loginUrl')
  loginUrl: string;
  @Config('defaultPassword')
  defaultPassword: string;

  getModel(): Repository<UserEntity> {
    return this.userModel;
  }

  /**
   * 分页获取用户列表
   * @param userPageDTO
   * @returns
   */
  async getUsersByPage(userPageDTO: UserPageDTO): Promise<UserPageVO> {
    const query = new FilterQuery<UserEntity>();

    query
      .append(
        'phoneNumber',
        like(userPageDTO.phoneNumber),
        !!userPageDTO.phoneNumber
      )
      .append('userName', like(userPageDTO.userName), !!userPageDTO.userName)
      .append('nickName', like(userPageDTO.nickName), !!userPageDTO.nickName)
      .append('email', like(userPageDTO.email), !!userPageDTO.email);

    const pageInfo = this.getPageByPageDTO(userPageDTO);

    const [data, total] = await this.userModel
      .createQueryBuilder('t')
      .leftJoinAndSelect(UserRoleEntity, 'user_role', 't.id = user_role.userId')
      .leftJoinAndMapMany(
        't.roles',
        RoleEntity,
        'role',
        'role.id = user_role.roleId'
      )
      .leftJoinAndMapOne(
        't.avatar',
        FileEntity,
        'file',
        'file.pkValue = t.id and file.pkName = "user_avatar"'
      )
      .where(query.where)
      .skip(pageInfo.skip)
      .take(pageInfo.take)
      .orderBy('t.createDate', 'DESC')
      .getManyAndCount();

    return {
      data: data.map(entity => entity.toVO()),
      total,
    };
  }

  /**
   * 创建用户
   * @param userDTO
   * @returns
   */
  async createUser(userDTO: UserDTO) {
    const entity = userDTO.toEntity();
    const { userName, phoneNumber, email } = userDTO;

    let notExist = (await this.userModel.countBy({ userName })) === 0;
    AssertUtils.isTrue(notExist, '当前用户名已存在');

    notExist = (await this.userModel.countBy({ phoneNumber })) === 0;
    AssertUtils.isTrue(notExist, '当前手机号已存在');

    notExist = (await this.userModel.countBy({ email })) === 0;
    AssertUtils.isTrue(notExist, '当前邮箱已存在');

    // 添加用户，对密码进行加盐加密
    const hashPassword = bcrypt.hashSync(this.defaultPassword, 10);
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

      await manager.save(
        UserRoleEntity,
        userDTO.roleIds.map(roleId => {
          const userRole = new UserRoleEntity();
          userRole.roleId = roleId;
          userRole.userId = entity.id;
          return userRole;
        })
      );

      // 构造策略对象
      const casbinRules = userDTO.roleIds.map(roleId => {
        const casbinRule = new CasbinRule();
        casbinRule.ptype = 'g';
        casbinRule.v0 = entity.id;
        casbinRule.v1 = roleId;
        return casbinRule;
      });

      // 保存策略
      await manager
        .createQueryBuilder()
        .insert()
        .into(CasbinRule)
        .values(casbinRules)
        .execute();

      this.mailService.sendMail({
        to: email,
        subject: `${this.title}平台账号创建成功`,
        html: `<div>
        <p><span style="color:#5867dd;">${userDTO.nickName}</span>，你的账号已开通成功</p>
        <p>登录地址：<a href="${this.loginUrl}">${this.loginUrl}</a></p>
        <p>登录账号：${userDTO.email}</p>
        <p>登录密码：${this.defaultPassword}</p>
        </div>`,
      });
    });

    // 发消息给其它进程，同步最新的策略
    this.casbinWatcher.publishData();
  }

  /**
   * 更新用户
   * @param userDTO
   * @returns
   */
  async updateUser(userDTO: UserDTO) {
    const { userName, phoneNumber, email, id, nickName, avatar } = userDTO;

    let user = await this.userModel.findOneBy({ userName, id: Not(id) });
    AssertUtils.isTrue(!user, '当前用户名已存在');

    user = await this.userModel.findOneBy({ phoneNumber, id: Not(id) });
    AssertUtils.notEmpty(!user, '当前手机号已存在');

    user = await this.userModel.findOneBy({ email, id: Not(id) });
    AssertUtils.notEmpty(!user, '当前邮箱已存在');

    const userRolesMap = await this.userRoleModel.findBy({
      userId: userDTO.id,
    });

    await this.defaultDataSource.transaction(async manager => {
      const casbinRules = userDTO.roleIds.map(roleId => {
        const casbinRule = new CasbinRule();
        casbinRule.ptype = 'g';
        casbinRule.v0 = userDTO.id;
        casbinRule.v1 = roleId;
        return casbinRule;
      });

      Promise.all([
        manager
          .createQueryBuilder()
          .update(UserEntity)
          .set({
            nickName,
            phoneNumber,
          })
          .where('id = :id', { id: userDTO.id })
          .execute(),
        manager.remove(UserRoleEntity, userRolesMap),
        manager.save(
          UserRoleEntity,
          userDTO.roleIds.map(roleId => {
            const userRole = new UserRoleEntity();
            userRole.roleId = roleId;
            userRole.userId = userDTO.id;
            return userRole;
          })
        ),
        await manager
          .createQueryBuilder()
          .delete()
          .from(CasbinRule)
          .where({ ptype: 'g', v0: userDTO.id })
          .execute(),
        await manager
          .createQueryBuilder()
          .insert()
          .into(CasbinRule)
          .values(casbinRules)
          .execute(),
      ]);

      // 根据当前用户id在文件表里查询
      const fileRecord = await this.fileModel.findOneBy({
        pkValue: id,
        pkName: 'user_avatar',
      });

      // 如果查到文件，并且当前头像是空的，只需要给原来的文件给删除就行了。
      if (fileRecord && !avatar) {
        await this.fileModel.remove(fileRecord);
      } else if (fileRecord && avatar && fileRecord.id !== avatar) {
        // 如果查到文件，并且有当前头像，并且原来的文件id不等于当前传过来的文件id
        // 删除原来的文件
        // 把当前的用户id更新到新文件行数据中
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
        // 如果以前没有文件，现在有文件，直接更新就行了
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

      // 检测当前用户分配的角色有没有变化，如果有变化，发通知给前端
      const oldRoleIds = userRolesMap.map(role => role.roleId);
      // 先判断两个数量是不是一样的
      if (oldRoleIds.length !== userDTO.roleIds.length) {
        this.socketService.sendMessage(userDTO.id, {
          type: SocketMessageType.PermissionChange,
        });
      } else {
        // 因为数组都是数字，所以先排序，排序之后把数组转换为字符串比较，写法比较简单
        const sortOldRoleIds = oldRoleIds.sort();
        const sortRoleIds = userDTO.roleIds.sort();

        if (sortOldRoleIds.join() !== sortRoleIds.join()) {
          this.socketService.sendMessage(userDTO.id, {
            type: SocketMessageType.PermissionChange,
          });
        }
      }
    });

    // 发消息给其它进程，同步最新的策略
    this.casbinWatcher.publishData();
  }

  /**
   * 删除用户
   * @param id
   */
  async removeUser(id: string) {
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
        manager
          .createQueryBuilder()
          .delete()
          .from(CasbinRule)
          .where({ ptype: 'g', v0: id })
          .execute(),
        ...tokens.map(token => this.redisService.del(`token:${token}`)),
        ...refreshTokens.map(refreshToken =>
          this.redisService.del(`refreshToken:${refreshToken}`)
        ),
      ]);
    });

    this.casbinWatcher.publishData();
  }

  /**
   * 根据邮箱获取用户
   */
  async getUserByEmail(email: string) {
    return await this.userModel.findOneBy({ email });
  }

  /**
   * 根据用户id获取已分配角色id 列表
   */
  async getRoleIdsByUserId(userId: string) {
    const query = this.userModel.createQueryBuilder('t');

    const user = (await query
      .where('t.id = :id', { id: userId })
      .leftJoinAndSelect(UserRoleEntity, 'userRole', 't.id = userRole.userId')
      .leftJoinAndMapMany(
        't.roles',
        RoleEntity,
        'role',
        'role.id = userRole.roleId'
      )
      .getOne()) as unknown as UserVO;

    return user?.roles?.map(o => o.id) || [];
  }
}
