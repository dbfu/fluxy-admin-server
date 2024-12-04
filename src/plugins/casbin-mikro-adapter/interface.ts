import { CasbinRule } from './casbinRule';

export type GenericCasbinRule = CasbinRule;
export type CasbinRuleConstructor = new (...args: any[]) => GenericCasbinRule;

export interface TypeORMAdapterConfig {
  dataSourceName?: string;
  type?: string;
  customCasbinRuleEntity?: CasbinRuleConstructor;
}
