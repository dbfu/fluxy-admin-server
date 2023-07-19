import { Config, Inject, Provide } from '@midwayjs/decorator';
import { InjectDataSource, InjectEntityModel } from '@midwayjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { UserEntity } from '../../user/entity/user';
import { R } from '../../../common/base.error.util';
import { LoginDTO } from '../dto/login';
import { TokenVO } from '../vo/token';
import { TokenConfig } from '../../../interface/token.config';
import { RedisService } from '@midwayjs/redis';
import { uuid } from '../../../utils/uuid';
import { RefreshTokenDTO } from '../dto/refresh.token';
import { Context } from 'koa';
import { FileEntity } from '../../file/entity/file';
import { ResetPasswordDTO } from '../dto/reset.password';
import { RSAService } from '../../../common/rsa.service';
import { CaptchaService } from './captcha';
import { UserRoleEntity } from '../../user/entity/user.role';
import { RoleEntity } from '../../role/entity/role';
import { RoleMenuEntity } from '../../role/entity/role.menu';
import { MenuEntity } from '../../menu/entity/menu';
import { SocketService } from '../../../socket/service';
import { SocketMessageType } from '../../../socket/message';
import { LoginLogEntity } from '../../login.log/entity/login.log';
import { getAddressByIp, getIp, getUserAgent } from '../../../utils/utils';

@Provide()
export class AuthService {
  @InjectEntityModel(UserEntity)
  userModel: Repository<UserEntity>;
  @Config('token')
  tokenConfig: TokenConfig;
  @Inject()
  redisService: RedisService;
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

  async login(loginDTO: LoginDTO): Promise<TokenVO> {
    const ip = getIp(this.ctx);
    const loginLog = new LoginLogEntity();
    loginLog.ip = ip;
    loginLog.address = getAddressByIp(loginLog.ip);
    loginLog.browser = getUserAgent(this.ctx).family;
    loginLog.os = getUserAgent(this.ctx).os.toString();
    loginLog.userName = loginDTO.accountNumber;

    try {
      const { accountNumber } = loginDTO;
      const user = await this.userModel
        .createQueryBuilder('user')
        .where('user.phoneNumber = :accountNumber', {
          accountNumber,
        })
        .orWhere('user.username = :accountNumber', { accountNumber })
        .orWhere('user.email = :accountNumber', { accountNumber })
        .select(['user.password', 'user.id', 'user.userName'])
        .getOne();

      if (!user) {
        throw R.error('账号或密码错误！');
      }

      if (!bcrypt.compareSync(loginDTO.password, user.password)) {
        throw R.error('用户名或密码错误！');
      }

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

      if (!result) {
        throw R.error('验证码错误');
      }

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
      this.loginLogModel.save(loginLog);
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
    const entity = await this.userModel
      .createQueryBuilder('t')
      .leftJoinAndSelect(UserRoleEntity, 'user_role', 't.id = user_role.userId')
      .leftJoinAndMapOne(
        't.avatarEntity',
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

    if (!entity) {
      throw R.error('当前用户不存在！');
    }

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
