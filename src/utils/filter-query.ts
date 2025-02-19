import { FindOptionsWhereProperty } from 'typeorm';

export class FilterQuery<T> {
  where: any = {};
  append<U extends keyof T>(
    key: U,
    value: FindOptionsWhereProperty<NonNullable<T[U]>>,
    operator: boolean | (() => boolean)
  ) {
    if (typeof operator === 'function') {
      if (operator()) {
        this.where[key] = value;
      }
    } else if (operator) {
      this.where[key] = value;
    }
    return this;
  }
}
