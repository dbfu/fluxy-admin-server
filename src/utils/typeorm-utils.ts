import { FindOperator, Like } from 'typeorm';

export function like(val: string): FindOperator<string> {
  return Like(`%${val}%`);
}
