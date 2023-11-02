import { CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
  @PrimaryColumn({ comment: '主键', name: 'id', type: 'bigint' })
  id?: string;
  @CreateDateColumn({ comment: '创建时间' })
  createDate?: Date;
  @UpdateDateColumn({ comment: '更新时间' })
  updateDate?: Date;
  toVO?(): any {
    return this;
  }
}
