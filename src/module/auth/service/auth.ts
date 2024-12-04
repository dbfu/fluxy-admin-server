import { Config, Inject, Provide } from '@midwayjs/decorator';
import { InjectDataSource, InjectEntityModel } from '@midwayjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { UserEntity } from '../../user/entity/user';
import { R } from '../../../common/base.error.util';
import { LoginDTO } from '../dto/login';
import { TokenVO } from '../vo/token';
import { TokenConfig } from '../../../interface/token.config';
import { RedisService } from '@midwayjs/redis';
import { uuid } from '../../../utils/uuid';
import { RefreshTokenDTO } from '../dto/refresh.token';
import { ResetPasswordDTO } from '../dto/reset.password';
import { RSAService } from '../../../common/rsa.service';
import { CaptchaService } from './captcha';
import { UserRoleEntity } from '../../user/entity/user.role';
import { RoleMenuEntity } from '../../role/entity/role.menu';
import { MenuEntity } from '../../menu/entity/menu';
import { SocketService } from '../../../socket/service';
import { SocketMessageType } from '../../../socket/message';
import { LoginLogEntity } from '../../login.log/entity/login.log';
import { getAddressByIp, getIp, getUserAgent } from '../../../utils/utils';
import { BaseService } from '../../../common/base.service';
import { EntityRepository } from '@mikro-orm/mysql';
import { AssertUtils } from '../../../utils/assert';

@Provide()
export class AuthService extends BaseService<UserEntity> {
  @InjectEntityModel(UserEntity)
  userModel: Repository<UserEntity>;
  @Config('token')
  tokenConfig: TokenConfig;
  @Inject()
  redisService: RedisService;
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

  getModel(): EntityRepository<UserEntity> {
    return this.repo(UserEntity);
  }

  async login(loginDTO: LoginDTO): Promise<TokenVO> {
    const ip = getIp(this.ctx);

    const loginLog = this.repo(LoginLogEntity).create({
      ip: ip,
      address: getAddressByIp(ip),
      browser: getUserAgent(this.ctx).family,
      os: getUserAgent(this.ctx).os.toString(),
      userName: loginDTO.accountNumber,
    });

    try {
      const { accountNumber } = loginDTO;

      const userRep = this.getRepository(UserEntity);

      const user = await userRep.findOne(
        {
          $or: [
            {
              phoneNumber: { $eq: accountNumber },
            },
            {
              email: { $eq: accountNumber },
            },
            {
              userName: { $eq: accountNumber },
            },
          ],
        },
        {
          populate: ['password'],
        }
      );

      AssertUtils.notEmpty(user, '账号或密码错误');

      AssertUtils.isTrue(
        bcrypt.compareSync(loginDTO.password, user.password),
        '用户名或密码错误'
      );

      const { expire, refreshExpire } = this.tokenConfig;

      const token = uuid();
      const refreshToken = uuid();

      // multi可以实现redis指令并发执行
      await this.redisService
        .multi()
        .set(
          `token:${token}`,
          JSON.stringify({ userId: user.id, refreshToken })
        )
        .expire(`token:${token}`, expire)
        .set(`refreshToken:${refreshToken}`, user.id)
        .expire(`refreshToken:${refreshToken}`, refreshExpire)
        .sadd(`userToken_${user.id}`, token)
        .sadd(`userRefreshToken_${user.id}`, refreshToken)
        .exec();

      const { captcha, captchaId } = loginDTO;

      const result = await this.captchaService.check(captchaId, captcha);

      AssertUtils.notEmpty(result, '验证码错误');

      loginLog.status = true;
      loginLog.message = '成功';

      return {
        expire,
        token,
        refreshExpire,
        refreshToken,
      } as TokenVO;
    } catch (error) {
      loginLog.status = false;
      loginLog.message = error?.message || '登录失败';
      throw error;
    } finally {
      this.em.persistAndFlush(loginLog);
    }
  }

  async refreshToken(refreshToken: RefreshTokenDTO): Promise<TokenVO> {
    const userId = await this.redisService.get(
      `refreshToken:${refreshToken.refreshToken}`
    );

    if (!userId) {
      throw R.error('用户凭证已过期，请重新登录！');
    }

    const { expire } = this.tokenConfig;

    const token = uuid();

    await this.redisService
      .multi()
      .set(`token:${token}`, JSON.stringify({ userId, refreshToken }))
      .expire(`token:${token}`, expire)
      .exec();

    const refreshExpire = await this.redisService.ttl(
      `refreshToken:${refreshToken.refreshToken}`
    );

    return {
      expire,
      token,
      refreshExpire,
      refreshToken: refreshToken.refreshToken,
    } as TokenVO;
  }

  async getUserById(userId: string) {
    const user = await this.repo(UserEntity).findOne(userId, {
      populate: ['roles'],
    });

    AssertUtils.notEmpty(user, '当前用户不存在！');

    let menus: MenuEntity[];

    // 超级管理员获取所有菜单
    if (userId === '1') {
      menus = await this.repo(MenuEntity).findAll();
    } else {
      const roleIds = user.roles.map(o => o.id);

      const menuIds = (
        await this.repo(RoleMenuEntity).findAll({
          where: { roleId: { $in: roleIds } },
        })
      ).map(role => role.menuId);
      menus = await this.repo(MenuEntity).findAll({
        where: { id: { $in: menuIds } },
      });
    }

    return {
      ...user.toVO(),
      menus,
    };
  }

  async resetPassword(resetPasswordDTO: ResetPasswordDTO) {
    const captcha = await this.redisService.get(
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
    const tokens = await this.redisService.smembers(`userToken_${user.id}`);
    const refreshTokens = await this.redisService.smembers(
      `userRefreshToken_${user.id}`
    );

    await this.defaultDataSource.transaction(async manager => {
      const hashPassword = bcrypt.hashSync(password, 10);
      user.password = hashPassword;
      await manager.save(UserEntity, user);

      await Promise.all([
        ...tokens.map(token => this.redisService.del(`token:${token}`)),
        ...refreshTokens.map(refreshToken =>
          this.redisService.del(`refreshToken:${refreshToken}`)
        ),
        this.redisService.del(
          `resetPasswordEmailCaptcha:${resetPasswordDTO.email}`
        ),
      ]);

      this.socketService.sendMessage(user.id, {
        type: SocketMessageType.PasswordChange,
      });
    });
  }
}
