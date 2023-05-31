import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';

@Entity('sys_auth')
export class AuthEntity extends BaseEntity {
  @Column({ comment: '名称' })
  name?: string;
  @Column({ comment: '代码' })
  code?: string;
}
