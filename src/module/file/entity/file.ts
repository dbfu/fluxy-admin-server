import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../../../common/base.entity';

@Entity({ tableName: 'sys_file' })
export class FileEntity extends BaseEntity {
  @Property({ comment: '文件名' })
  fileName?: string;
  @Property({ comment: '文件路径' })
  filePath?: string;
  @Property({ comment: '外健名称', nullable: true })
  pkName: string;
  @Property({ comment: '外健值', nullable: true })
  pkValue?: string;
}
