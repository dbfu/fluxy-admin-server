import { FilterQuery, FilterValue } from '@mikro-orm/mysql';

export class FilterParams<T> {
  where: FilterQuery<T> = {};
  append<U extends keyof T>(
    key: U,
    value: FilterValue<string>,
    operator: boolean | (() => boolean)
  ): FilterParams<T> {
    if (typeof operator === 'function') {
      if (operator()) {
        this.where[key as any] = value;
      }
    } else if (operator) {
      this.where[key as any] = value;
    }

    return this;
  }
}
