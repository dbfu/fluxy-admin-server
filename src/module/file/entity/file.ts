import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';

@Entity('sys_file')
export class FileEntity extends BaseEntity {
  @Column({ comment: '文件名' })
  fileName?: string;
  @Column({ comment: '文件路径' })
  filePath?: string;
  @Column({ comment: '外健名称', nullable: true })
  pkName: string;
  @Column({ comment: '外健值', nullable: true })
  pkValue?: number;
}
