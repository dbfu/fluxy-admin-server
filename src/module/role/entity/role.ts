import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';

@Entity('sys_role')
export class RoleEntity extends BaseEntity {
  @Column({ comment: '名称' })
  name?: string;
  @Column({ comment: '代码' })
  code?: string;
}
