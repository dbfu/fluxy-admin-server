import { Inject } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { InjectDataSource } from '@midwayjs/typeorm';
import {
  DataSource,
  FindManyOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { BaseEntity } from './base-entity';
import { PageDTO } from './page-dto';

export abstract class BaseService<T extends BaseEntity = any> {
  @Inject()
  ctx: Context;

  @InjectDataSource()
  defaultDataSource: DataSource;

  abstract getModel(): Repository<T>;

  async create(entity: T): Promise<any> {
    return await this.getModel().save(entity);
  }

  async edit(entity: T): Promise<any> {
    return await this.getModel().save(entity);
  }

  async remove(entity: T) {
    await this.getModel().remove(entity);
  }

  async getById(id: string): Promise<T> {
    return await this.getModel()
      .createQueryBuilder('model')
      .where('model.id = :id', { id })
      .getOne();
  }

  async page(pageDTO: PageDTO, options: FindManyOptions<T> = {}) {
    if (!options.order) {
      options.order = { createDate: 'DESC' } as any;
    }

    const pageInfo = this.getPageByPageDTO(pageDTO);

    const [data, total] = await this.getModel().findAndCount({
      ...options,
      skip: pageInfo.skip,
      take: pageInfo.take,
    });

    return {
      data: data.map(entity => entity.toVO()),
      total,
    };
  }

  async list(where?: FindOptionsWhere<T>) {
    const order: any = { createDate: 'desc' };
    const data = await this.getModel().find({
      where,
      order,
    });

    return data;
  }

  /**
   * 获取分页参数
   */
  getPageByPageDTO(pageInfo: PageDTO) {
    return {
      skip: pageInfo.page * pageInfo.size,
      take: pageInfo.size,
    };
  }
}
