import { Inject } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { InjectDataSource } from '@midwayjs/typeorm';
import { DataSource, FindManyOptions, Repository } from 'typeorm';
import { BaseEntity } from './base-entity';
import { PageDTO } from './page-dto';

export abstract class BaseService<T extends BaseEntity = any> {
  @Inject()
  ctx: Context;

  @InjectDataSource()
  defaultDataSource: DataSource;

  abstract getModel(): Repository<T>;

  async create(entity: T): Promise<T> {
    return await this.getModel().save(entity);
  }

  async edit(entity: T): Promise<T> {
    return await this.getModel().save(entity);
  }

  async remove(entity: T) {
    await this.getModel().remove(entity);
  }

  async removeById(id: string) {
    await this.getModel()
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .execute();
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

  async list(options: FindManyOptions<T> = {}) {
    if (!options.order) {
      options.order = { createDate: 'DESC' } as any;
    }

    const data = await this.getModel().find(options);

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
