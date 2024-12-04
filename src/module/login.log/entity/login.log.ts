import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../../../common/base.entity';

@Entity({ tableName: 'sys_login_log' })
export class LoginLogEntity extends BaseEntity {
  @Property({ comment: '用户名' })
  userName?: string;
  @Property({ comment: '登录ip' })
  ip?: string;
  @Property({ comment: '登录地点' })
  address?: string;
  @Property({ comment: '浏览器' })
  browser?: string;
  @Property({ comment: '操作系统' })
  os?: string;
  @Property({ comment: '登录状态' })
  status?: boolean;
  @Property({ comment: '登录消息' })
  message?: string;
}
