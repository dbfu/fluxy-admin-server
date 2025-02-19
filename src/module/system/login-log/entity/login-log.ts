import { ApiProperty } from '@midwayjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../../common/base-entity';

@Entity('sys_login_log')
export class LoginLogEntity extends BaseEntity {
  @ApiProperty({ description: '用户名' })
  @Column({ comment: '用户名' })
  userName?: string;

  @ApiProperty({ description: '登录ip' })
  @Column({ comment: '登录ip' })
  ip?: string;

  @ApiProperty({ description: '登录地点' })
  @Column({ comment: '登录地点' })
  address?: string;

  @ApiProperty({ description: '浏览器' })
  @Column({ comment: '浏览器' })
  browser?: string;

  @ApiProperty({ description: '操作系统' })
  @Column({ comment: '操作系统' })
  os?: string;

  @ApiProperty({ description: '登录状态' })
  @Column({ comment: '登录状态' })
  status?: boolean;

  @ApiProperty({ description: '登录消息' })
  @Column({ comment: '登录消息' })
  message?: string;
}
