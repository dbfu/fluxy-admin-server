import { EntityManager, EntityRepository } from '@mikro-orm/mysql';
import { CasbinRule } from './casbinRule';
import { GenericCasbinRule } from './interface';
import { BaseAdapter } from '@midwayjs/casbin';

/**
 * TypeORMAdapter represents the TypeORM filtered adapter for policy storage.
 */
export class MikroORMAdapter extends BaseAdapter<GenericCasbinRule> {
  protected savePolicyByAdapter(policies: any[]): any {
    console.log(policies);
  }

  protected removePolicyByAdapter(removePolicy: any): any {
    console.log(removePolicy);
  }

  private em = null as EntityManager;

  constructor(em: EntityManager) {
    super();
    this.em = em;
  }

  private getRepository(): EntityRepository<GenericCasbinRule> {
    return this.em.getRepository(this.getAdapterLine());
  }

  protected getAdapterLine(): new () => GenericCasbinRule {
    return CasbinRule;
  }
  protected async loadPolicyByAdapter(): Promise<GenericCasbinRule[]> {
    return this.getRepository().findAll();
  }
  protected async loadPolicyWithFilterByAdapter(
    filter: any
  ): Promise<GenericCasbinRule[]> {
    return this.getRepository().findAll({ where: filter });
  }
}
