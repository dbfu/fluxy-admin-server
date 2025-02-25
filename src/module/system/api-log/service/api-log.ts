import { Provide } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { BaseService } from '../../../../common/base-service';
import { PageDTO } from '../../../../common/page-dto';
import { getIp } from '../../../../utils/utils';
import { UserEntity } from '../../user/entity/user';
import { ApiLogEntity } from '../entity/api-log';

@Provide()
export class ApiLogService extends BaseService<ApiLogEntity> {
  @InjectEntityModel(ApiLogEntity)
  apiLogModel: Repository<ApiLogEntity>;

  getModel(): Repository<ApiLogEntity> {
    return this.apiLogModel;
  }

  async page(
    pageDTO: PageDTO,
    options?: FindManyOptions<ApiLogEntity>
  ): Promise<{ data: any[]; total: number }> {
    const [data, total] = await this.apiLogModel
      .createQueryBuilder('apiLog')
      .leftJoinAndMapOne(
        'apiLog.user',
        UserEntity,
        'user',
        'apiLog.userId = user.id'
      )
      .select(['apiLog'])
      .addSelect('user.userName')
      .take(pageDTO.size)
      .skip(pageDTO.page * pageDTO.size)
      .orderBy('apiLog.createDate', 'DESC')
      .addOrderBy('apiLog.updateDate', 'DESC')
      .where(options?.where)
      .getManyAndCount();

    return {
      data: data.map(o => o.toVO()),
      total,
    };
  }

  // 通过id查询请求query参数
  async getQueryData(id: string) {
    return await this.apiLogModel.findOne({
      where: { id },
      select: ['id', 'query'],
    });
  }

  // 通过id查询请求body参数
  async getBodyData(id: string) {
    return await this.apiLogModel.findOne({
      where: { id },
      select: ['id', 'body'],
    });
  }

  // 通过id查询响应结果
  async getResultData(id: string) {
    return await this.apiLogModel.findOne({
      where: { id },
      select: ['id', 'result'],
    });
  }

  // 创建api日志
  async createApiLog(
    ctx: Context,
    success: boolean,
    errorType?: string,
    errorMsg?: string
  ) {
    const apiLog = new ApiLogEntity();
    apiLog.url = ctx.path;
    apiLog.method = ctx.method;
    apiLog.duration =
      new Date().getTime() -
      (ctx.requestStartTime?.getTime() || new Date().getTime());
    apiLog.startTime = ctx.requestStartTime || new Date();
    apiLog.endTime = new Date();
    apiLog.ip = getIp(ctx);
    apiLog.query = JSON.stringify(ctx.request.query);
    apiLog.body = JSON.stringify(ctx.request.body);
    apiLog.result = JSON.stringify(ctx.body);
    apiLog.userId = ctx.userInfo?.userId;

    apiLog.success = success;
    apiLog.errorType = errorType;
    apiLog.errorMsg = errorMsg;

    return await this.create(apiLog);
  }
}
