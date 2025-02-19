import { ApiProperty } from '@midwayjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../../common/base-entity';

@Entity('sys_menu')
export class MenuEntity extends BaseEntity {
  @ApiProperty({ description: '上级id' })
  @Column({ comment: '上级id', nullable: true })
  parentId?: string;

  @ApiProperty({ description: '名称' })
  @Column({ comment: '名称' })
  name?: string;

  @ApiProperty({ description: '图标' })
  @Column({ comment: '图标', nullable: true })
  icon?: string;

  @ApiProperty({ description: '类型' })
  @Column({ comment: '类型，1:目录 2:菜单 3:按钮 4:低代码页面' })
  type?: number;

  @ApiProperty({ description: '路由' })
  @Column({ comment: '路由', nullable: true })
  route?: string;

  @ApiProperty({ description: '本地组件地址' })
  @Column({ comment: '本地组件地址', nullable: true })
  filePath?: string;

  @ApiProperty({ description: '排序号' })
  @Column({ comment: '排序号', nullable: true })
  orderNumber?: number;

  @ApiProperty({ description: 'url' })
  @Column({ comment: 'url', nullable: true })
  url?: string;

  @ApiProperty({ description: '是否在菜单中显示' })
  @Column({ comment: '是否在菜单中显示' })
  show?: boolean;

  @ApiProperty({ description: '按钮权限代码' })
  @Column({ comment: '按钮权限代码', nullable: true })
  authCode?: string;

  @ApiProperty({ description: '低代码页面当前版本号' })
  @Column({ comment: '低代码页面当前版本号', nullable: true })
  curVersion?: string;
}
