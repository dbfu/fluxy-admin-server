import { ApiProperty } from '@midwayjs/swagger';
import { CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
  @ApiProperty({ description: 'id' })
  @PrimaryColumn({ comment: '主键', name: 'id', type: 'bigint' })
  id?: string;

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn({ comment: '创建时间' })
  createDate?: Date;

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn({ comment: '更新时间' })
  updateDate?: Date;
  toVO?(): any {
    return this;
  }
}
