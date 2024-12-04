import { PrimaryKey, Property, wrap } from '@mikro-orm/core';

export class BaseEntity {
  @PrimaryKey({ comment: '主键', name: 'id', type: 'bigint' })
  id?: string;
  @Property({ comment: '创建时间' })
  createDate?: Date = new Date();
  @Property({ comment: '更新时间', onUpdate: () => new Date() })
  updateDate?: Date = new Date();
  toVO?(): any {
    return this;
  }
  toObject?(): any {
    return wrap(this).toObject();
  }
}
