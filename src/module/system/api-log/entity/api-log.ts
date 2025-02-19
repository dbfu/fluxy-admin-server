import { ApiProperty } from '@midwayjs/swagger';
import { omit } from 'lodash';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../../common/base-entity';
import { UserEntity } from '../../user/entity/user';

@Entity('sys_api_log')
export class ApiLogEntity extends BaseEntity {
  @ApiProperty({ description: '接口url' })
  @Column({ comment: '接口url' })
  url: string;

  @ApiProperty({ description: '请求方式' })
  @Column({ comment: '请求方式' })
  method: string;

  @ApiProperty({ description: '是否成功' })
  @Column({ comment: '是否成功' })
  success: boolean;

  @ApiProperty({ description: '请求query参数' })
  @Column({
    comment: '请求query参数',
    type: 'longtext',
    nullable: true,
    select: false,
  })
  query?: string;

  @ApiProperty({ description: '请求body参数' })
  @Column({
    comment: '请求body参数',
    type: 'longtext',
    nullable: true,
    select: false,
  })
  body?: string;

  @ApiProperty({ description: '开始时间' })
  @Column({ comment: '开始时间' })
  startTime: Date;

  @ApiProperty({ description: '结束时间' })
  @Column({ comment: '结束时间' })
  endTime: Date;

  @ApiProperty({ description: '耗时' })
  @Column({ comment: '耗时' })
  duration: number;

  @ApiProperty({ description: '响应结果' })
  @Column({
    comment: '响应结果',
    type: 'longtext',
    select: false,
    nullable: true,
  })
  result?: string;

  @ApiProperty({ description: '请求ip' })
  @Column({ comment: '请求ip' })
  ip: string;

  @ApiProperty({ description: '错误类型' })
  @Column({ comment: '错误类型', nullable: true })
  errorType?: string;

  @ApiProperty({ description: '错误消息' })
  @Column({ comment: '错误消息', nullable: true })
  errorMsg?: string;

  @ApiProperty({ description: '用户Id' })
  @Column({ comment: '用户Id', nullable: true })
  userId?: string;

  user: UserEntity;

  @ApiProperty({ description: '用户名' })
  userName?: string;

  toVO() {
    this.userName = this.user?.userName;
    return omit(this, ['user']);
  }
}
