import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn({ comment: '主键' })
  id?: number;
  @CreateDateColumn({ comment: '创建时间' })
  createDate?: Date;
  @UpdateDateColumn({ comment: '更新时间' })
  updateDate?: Date;
  toVO(): any {
    return this;
  }
}
