import {
  ALL,
  Body,
  Controller,
  Del,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@midwayjs/core';
import { ApiOkResponse, ApiResponse } from '@midwayjs/swagger';
import { Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { FilterQuery } from '../../../../utils/filter-query';
import { like } from '../../../../utils/typeorm-utils';
import { ApiLogDTO } from '../dto/api-log';
import { ApiLogPageDTO } from '../dto/api-log-page';
import { ApiLogEntity } from '../entity/api-log';
import { ApiLogService } from '../service/api-log';
import { ApiLogPageVO } from '../vo/api-log-page';
import { BodyParamsVO } from '../vo/body-params';
import { QueryParamsVO } from '../vo/query-params';
import { ResultParamsVO } from '../vo/result-params';

@Controller('/api-log', { description: '接口日志' })
export class ApiLogController {
  @Inject()
  apiLogService: ApiLogService;

  @Post('/', { description: '新建' })
  async create(@Body(ALL) data: ApiLogDTO) {
    return await this.apiLogService.create(data.toEntity());
  }

  @Put('/', { description: '编辑' })
  async edit(@Body(ALL) data: ApiLogDTO) {
    const apiLog = await this.apiLogService.getById(data.id);
    // update
    return await this.apiLogService.edit(apiLog);
  }

  @Del('/:id', { description: '删除' })
  async remove(@Param('id') id: string) {
    await this.apiLogService.removeById(id);
  }

  @Get('/:id', { description: '根据id查询' })
  async getById(@Param('id') id: string) {
    return await this.apiLogService.getById(id);
  }

  @Get('/page', { description: '分页查询' })
  @ApiResponse({ type: ApiLogPageVO })
  async page(@Query() apiLogPageDTO: ApiLogPageDTO) {
    const filterQuery = new FilterQuery<ApiLogEntity>();
    filterQuery.append('url', like(apiLogPageDTO.url), !!apiLogPageDTO.url);
    filterQuery.append('method', apiLogPageDTO.method, !!apiLogPageDTO.method);
    filterQuery.append(
      'success',
      apiLogPageDTO.success,
      !!apiLogPageDTO.success
    );

    filterQuery.append(
      'startTime',
      Between(apiLogPageDTO.startTimeStart, apiLogPageDTO.startTimeEnd),
      !!apiLogPageDTO.startTimeStart && !!apiLogPageDTO.startTimeEnd
    );

    filterQuery.append(
      'endTime',
      Between(apiLogPageDTO.endTimeStart, apiLogPageDTO.endTimeEnd),
      !!apiLogPageDTO.endTimeStart && !!apiLogPageDTO.endTimeEnd
    );

    filterQuery.append(
      'duration',
      Between(apiLogPageDTO.durationStart, apiLogPageDTO.durationEnd),
      !!apiLogPageDTO.durationStart || !!apiLogPageDTO.durationEnd
    );

    if (apiLogPageDTO.durationStart && !apiLogPageDTO.durationEnd) {
      filterQuery.append(
        'duration',
        MoreThanOrEqual(apiLogPageDTO.durationStart),
        true
      );
    }

    if (!apiLogPageDTO.durationStart && apiLogPageDTO.durationEnd) {
      filterQuery.append(
        'duration',
        LessThanOrEqual(apiLogPageDTO.durationEnd),
        true
      );
    }

    filterQuery.append('ip', like(apiLogPageDTO.ip), !!apiLogPageDTO.ip);

    filterQuery.append(
      'errorType',
      like(apiLogPageDTO.errorType),
      !!apiLogPageDTO.errorType
    );

    const { page, size } = apiLogPageDTO;

    return await this.apiLogService.page(
      {
        page,
        size,
      },
      { where: filterQuery.where }
    );
  }

  @Get('/list', { description: '查询全部' })
  async list() {
    return await this.apiLogService.list();
  }

  @Get('/query', { description: '查看请求query参数' })
  @ApiOkResponse({
    type: QueryParamsVO,
  })
  async getQueryData(@Query('id') id: string) {
    return await this.apiLogService.getQueryData(id);
  }

  @Get('/body', { description: '查看请求body参数' })
  @ApiOkResponse({
    type: BodyParamsVO,
  })
  async getBodyData(@Query('id') id: string) {
    return await this.apiLogService.getBodyData(id);
  }

  @Get('/result', { description: '查看响应结果' })
  @ApiOkResponse({
    type: ResultParamsVO,
  })
  async getResultData(@Query('id') id: string) {
    return await this.apiLogService.getResultData(id);
  }
}
