import { Config, Inject, Provide } from '@midwayjs/decorator';
import { InjectDataSource, InjectEntityModel } from '@midwayjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { DataSource, In, Repository } from 'typeorm';

import { RedisService } from '@midwayjs/redis';
import { Context } from 'koa';
import { R } from '../../../../common/base-error-util';
import { RSAService } from '../../../../common/rsa-service';
import { TokenConfig } from '../../../../interface';
import { AssertUtils } from '../../../../utils/assert';
import { uuid } from '../../../../utils/uuid';
import { FileEntity } from '../../file/entity/file';
import { LoginLogEntity } from '../../login-log/entity/login-log';
import { MenuEntity } from '../../menu/entity/menu';
import { RoleEntity } from '../../role/entity/role';
import { RoleMenuEntity } from '../../role/entity/role-menu';
import { SocketService } from '../../socket/service/socket';
import { SocketMessageType } from '../../socket/type';
import { UserEntity } from '../../user/entity/user';
import { UserRoleEntity } from '../../user/entity/user-role';
import { LoginDTO } from '../dto/login';
import { RefreshTokenDTO } from '../dto/refresh-token';
import { ResetPasswordDTO } from '../dto/reset-password';
import { CurrentUserVO } from '../vo/current-user';
import { TokenVO } from '../vo/token';
import { CaptchaService } from './captcha';

@Provide()
export class AuthService {
  @InjectEntityModel(UserEntity)
  userModel: Repository<UserEntity>;
  @Config('token')
  tokenConfig: TokenConfig;
  @Inject()
  redis: RedisService;
  @Inject()
  ctx: Context;
  @Inject()
  rsaService: RSAService;
  @InjectDataSource()
  defaultDataSource: DataSource;
  @Inject()
  captchaService: CaptchaService;
  @InjectEntityModel(UserRoleEntity)
  userRoleModel: Repository<UserRoleEntity>;
  @InjectEntityModel(RoleMenuEntity)
  roleMenuModel: Repository<RoleMenuEntity>;
  @InjectEntityModel(LoginLogEntity)
  loginLogModel: Repository<LoginLogEntity>;
  @InjectEntityModel(MenuEntity)
  menuModel: Repository<MenuEntity>;
  @Inject()
  socketService: SocketService;

  /**
   * 登录
   * @param loginDTO
   */
  async login(loginDTO: LoginDTO): Promise<TokenVO> {
    const { accountNumber, captcha, captchaId } = loginDTO;

    const result = await this.captchaService.check(captchaId, captcha);

    AssertUtils.isTrue(result, '验证码错误');

    const user = await this.userModel
      .createQueryBuilder('user')
      .where('user.phoneNumber = :accountNumber', {
        accountNumber,
      })
      .orWhere('user.username = :accountNumber', { accountNumber })
      .orWhere('user.email = :accountNumber', { accountNumber })
      .select(['user.password', 'user.id', 'user.userName'])
      .getOne();

    AssertUtils.notEmpty(user, '账号或密码错误！');

    AssertUtils.isTrue(
      bcrypt.compareSync(loginDTO.password, user.password),
      '用户名或密码错误！'
    );

    const { expire, refreshExpire } = this.tokenConfig;

    const token = uuid();
    const refreshToken = uuid();

    // multi可以实现redis指令并发执行
    await this.redis
      .multi()
      .set(`token:${token}`, JSON.stringify({ userId: user.id, refreshToken }))
      .expire(`token:${token}`, expire)
      .set(`refreshToken:${refreshToken}`, user.id)
      .expire(`refreshToken:${refreshToken}`, refreshExpire)
      .sadd(`userToken_${user.id}`, token)
      .sadd(`userRefreshToken_${user.id}`, refreshToken)
      .exec();

    return {
      expire,
      token,
      refreshExpire,
      refreshToken,
    } as TokenVO;
  }

  /**
   * 刷新token
   * @param refreshToken
   */
  async refreshToken(refreshToken: RefreshTokenDTO): Promise<TokenVO> {
    const userId = await this.redis.get(
      `refreshToken:${refreshToken.refreshToken}`
    );

    AssertUtils.notEmpty(userId, '用户凭证已过期，请重新登录！');

    const { expire } = this.tokenConfig;

    const token = uuid();

    await this.redis
      .multi()
      .set(`token:${token}`, JSON.stringify({ userId, refreshToken }))
      .expire(`token:${token}`, expire)
      .exec();

    const refreshExpire = await this.redis.ttl(
      `refreshToken:${refreshToken.refreshToken}`
    );

    return {
      expire,
      token,
      refreshExpire,
      refreshToken: refreshToken.refreshToken,
    } as TokenVO;
  }

  /**
   * 获取用户信息
   * @param userId
   * @returns
   */
  async getUserById(userId: string): Promise<CurrentUserVO> {
    const entity = await this.userModel
      .createQueryBuilder('t')
      .leftJoinAndSelect(UserRoleEntity, 'user_role', 't.id = user_role.userId')
      .leftJoinAndMapOne(
        't.avatar',
        FileEntity,
        'file',
        'file.pkValue = t.id and file.pkName = "user_avatar"'
      )
      .leftJoinAndMapMany(
        't.roles',
        RoleEntity,
        'role',
        'role.id = user_role.roleId'
      )
      .where('t.id = :id', { id: userId })
      .getOne();

    AssertUtils.notEmpty(entity, '当前用户不存在！');

    // 先把用户分配的角色查出来
    const userRoles = await this.userRoleModel.findBy({ userId: userId });
    // 根据已分配角色查询已分配的菜单id数组
    const roleMenus = await this.roleMenuModel.find({
      where: { roleId: In(userRoles.map(userRole => userRole.roleId)) },
    });
    // 根据菜单id数组查询菜单信息，这里加了个特殊判断，如果是管理员直接返回全部菜单，正常这个应该走数据迁移，数据迁移还没做，就先用这种方案。
    const query = { id: In(roleMenus.map(roleMenu => roleMenu.menuId)) };
    const menus = await this.menuModel.find({
      where: userId === '1' ? {} : query,
      order: { orderNumber: 'ASC', createDate: 'DESC' },
    });

    return {
      ...entity.toVO(),
      menus,
    };
  }

  /**
   * 重置密码
   * @param resetPasswordDTO
   */
  async resetPassword(resetPasswordDTO: ResetPasswordDTO) {
    const captcha = await this.redis.get(
      `resetPasswordEmailCaptcha:${resetPasswordDTO.email}`
    );

    if (captcha !== resetPasswordDTO.emailCaptcha) {
      throw R.error('邮箱验证码错误或已失效');
    }

    const user = await this.userModel.findOneBy({
      email: resetPasswordDTO.email,
    });

    if (!user) {
      throw R.error('邮箱不存在');
    }

    const password = await this.rsaService.decrypt(
      resetPasswordDTO.publicKey,
      resetPasswordDTO.password
    );

    // 获取当前用户颁发的token和refreshToken，然后再下面给移除掉。
    const tokens = await this.redis.smembers(`userToken_${user.id}`);
    const refreshTokens = await this.redis.smembers(
      `userRefreshToken_${user.id}`
    );

    await this.defaultDataSource.transaction(async manager => {
      const hashPassword = bcrypt.hashSync(password, 10);
      user.password = hashPassword;
      await manager.save(UserEntity, user);

      await Promise.all([
        ...tokens.map(token => this.redis.del(`token:${token}`)),
        ...refreshTokens.map(refreshToken =>
          this.redis.del(`refreshToken:${refreshToken}`)
        ),
        this.redis.del(`resetPasswordEmailCaptcha:${resetPasswordDTO.email}`),
      ]);

      this.socketService.sendMessage(user.id, {
        type: SocketMessageType.PasswordChange,
      });
    });
  }
}
