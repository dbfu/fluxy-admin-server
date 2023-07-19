import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';

@Entity('sys_login_log')
export class LoginLogEntity extends BaseEntity {
  @Column({ comment: '用户名' })
  userName?: string;
  @Column({ comment: '登录ip' })
  ip?: string;
  @Column({ comment: '登录地点' })
  address?: string;
  @Column({ comment: '浏览器' })
  browser?: string;
  @Column({ comment: '操作系统' })
  os?: string;
  @Column({ comment: '登录状态' })
  status?: boolean;
  @Column({ comment: '登录消息' })
  message?: string;
}
