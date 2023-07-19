import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';

@Entity('sys_menu')
export class MenuEntity extends BaseEntity {
  @Column({ comment: '上级id', nullable: true })
  parentId?: string;
  @Column({ comment: '名称' })
  name?: string;
  @Column({ comment: '图标', nullable: true })
  icon?: string;
  @Column({ comment: '类型，1:目录 2:菜单' })
  type?: number;
  @Column({ comment: '路由', nullable: true })
  route?: string;
  @Column({ comment: '本地组件地址', nullable: true })
  filePath?: string;
  @Column({ comment: '排序号', nullable: true })
  orderNumber?: number;
  @Column({ comment: 'url', nullable: true })
  url?: string;
  @Column({ comment: '是否在菜单中显示' })
  show?: boolean;
  @Column({ comment: '按钮权限代码', nullable: true })
  authCode?: string;
}
