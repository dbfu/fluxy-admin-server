import { ApiProperty } from '@midwayjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../../common/base-entity';

@Entity('sys_file')
export class FileEntity extends BaseEntity {
  @ApiProperty({ description: '文件名' })
  @Column({ comment: '文件名' })
  fileName?: string;

  @ApiProperty({ description: '文件路径' })
  @Column({ comment: '文件路径' })
  filePath?: string;

  @ApiProperty({ description: '外健名称' })
  @Column({ comment: '外健名称', nullable: true })
  pkName: string;

  @ApiProperty({ description: '外健值' })
  @Column({ comment: '外健值', nullable: true })
  pkValue?: string;
}
