import { ApiProperty } from '@midwayjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../../common/base-entity';

@Entity('sys_role')
export class RoleEntity extends BaseEntity {
  @ApiProperty({ description: '名称' })
  @Column({ comment: '名称' })
  name?: string;

  @ApiProperty({ description: '代码' })
  @Column({ comment: '代码' })
  code?: string;
}
