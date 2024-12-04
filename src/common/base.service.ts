import { Inject } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { BaseEntity } from './base.entity';
import { InjectEntityManager } from '@midwayjs/mikro';
import { EntityName, FilterQuery, GetRepository } from '@mikro-orm/core';
import { EntityManager, EntityRepository } from '@mikro-orm/mysql';

export abstract class BaseService<T extends BaseEntity> {
  @Inject()
  ctx: Context;

  @InjectEntityManager()
  em: EntityManager;

  curModel: EntityRepository<T>;

  repo<
    Entity extends object,
    Repository extends EntityRepository<Entity> = EntityRepository<Entity>
  >(entityName: EntityName<Entity>): GetRepository<Entity, Repository> {
    return this.em.getRepository(entityName);
  }

  getRepository<
    Entity extends object,
    Repository extends EntityRepository<Entity> = EntityRepository<Entity>
  >(entityName: EntityName<Entity>): GetRepository<Entity, Repository> {
    return this.em.getRepository(entityName);
  }

  abstract getModel(): EntityRepository<T>;

  async create(entity: T): Promise<any> {
    return await this.em.persistAndFlush(entity);
  }

  async edit(entity: T): Promise<any> {
    return await this.em.persistAndFlush(entity);
  }

  async remove(entity: T) {
    await this.em.removeAndFlush(entity);
  }

  async getById(id: string): Promise<T> {
    const model = this.getModel() as unknown as EntityRepository<T>;

    return await model.findOne<string>({
      id: { $eq: id },
    } as unknown as FilterQuery<T>);
  }

  async page(page = 0, pageSize = 10, where?: FilterQuery<T>) {
    const order: any = { createDate: 'desc' };

    const [data, total] = await this.getModel().findAndCount(where, {
      offset: page * pageSize,
      limit: pageSize,
      orderBy: order,
    });

    return { data: data.map(entity => entity.toVO()), total };
  }

  async list(where?: FilterQuery<T>) {
    const order: any = { createDate: 'desc' };
    const data = await this.getModel().find(where, { orderBy: order });
    return data;
  }
}
