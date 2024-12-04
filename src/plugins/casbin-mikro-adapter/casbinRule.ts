import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../../common/base.entity';

@Entity({ tableName: 'sys_casbin_rule' })
export class CasbinRule extends BaseEntity {
  @Property({
    nullable: true,
  })
  public ptype: string;

  @Property({
    nullable: true,
  })
  public v0: string;

  @Property({
    nullable: true,
  })
  public v1: string;

  @Property({
    nullable: true,
  })
  public v2: string;

  @Property({
    nullable: true,
  })
  public v3: string;

  @Property({
    nullable: true,
  })
  public v4: string;

  @Property({
    nullable: true,
  })
  public v5: string;

  @Property({
    nullable: true,
  })
  public v6: string;
}
