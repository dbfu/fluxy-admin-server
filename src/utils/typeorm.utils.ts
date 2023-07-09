import * as _ from 'lodash';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PageDTO } from '../common/page.dto';
import { PageResultVO } from '../common/page.result.vo';

/**
 * 获取不包含前缀的api
 * @param globalPrefix 前缀
 * @param url url
 * @returns url
 */
export function getUrlExcludeGlobalPrefix(
  globalPrefix: string,
  url: string
): string {
  if (url.startsWith(globalPrefix)) {
    return url.substring(globalPrefix.length);
  }

  return url;
}

export function like(val: string): string {
  return `%${val}%`;
}

export function createQueryBuilder<T>(
  model: Repository<T>,
  alias?: string
): SelectQueryBuilder<T> {
  const query = model.createQueryBuilder(alias || 't');
  return query.where('1=1');
}

export function queryByQueryBuilder<T>(
  queryBuilder: SelectQueryBuilder<T>,
  obj: T,
  alias?: string
): SelectQueryBuilder<T> {
  if (!obj) return queryBuilder;

  Object.keys(obj).forEach(key => {
    if (!_.isNil(obj[key]) && obj[key] !== '') {
      queryBuilder = queryBuilder.andWhere(`${alias || 't'}.${key} = :${key}`, {
        [key]: obj[key],
      });
    }
  });

  return queryBuilder;
}

export function likeQueryByQueryBuilder<T>(
  queryBuilder: SelectQueryBuilder<T>,
  obj: T,
  alias?: string
): SelectQueryBuilder<T> {
  if (!obj) return queryBuilder;

  Object.keys(obj).forEach((key: string) => {
    if (!_.isNil(obj[key]) && obj[key] !== '') {
      queryBuilder = queryBuilder.andWhere(
        `${alias || 't'}.${key} like :${key}`,
        { [key]: like(obj[key]) }
      );
    }
  });

  return queryBuilder;
}

export async function pageQueryByQueryBuilder<T>(
  queryBuilder: SelectQueryBuilder<T>,
  pageDTO: PageDTO
): Promise<PageResultVO<T>> {
  const { page, size } = pageDTO;
  const [data, total] = await queryBuilder
    .skip(page * size)
    .take(size)
    .getManyAndCount();

  return {
    data,
    total,
    page,
    size,
  };
}
