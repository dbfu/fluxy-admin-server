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
} from '@midwayjs/decorator';
import { ApiOkResponse } from '@midwayjs/swagger';
import { FilterQuery } from '../../../../utils/filter-query';
import { like } from '../../../../utils/typeorm-utils';
import { LoginLogDTO } from '../dto/login-log';
import { LoginLogPageDTO } from '../dto/login-log-page';
import { LoginLogEntity } from '../entity/login-log';
import { LoginLogService } from '../service/login-log';
import { LoginLogVO } from '../vo/login-log';

@Controller('/login-log', { description: '登录日志' })
export class LoginLogController {
  @Inject()
  loginLogService: LoginLogService;

  @Post('/', { description: '新建' })
  async create(@Body(ALL) data: LoginLogDTO) {
    return await this.loginLogService.create(data.toEntity());
  }

  @Put('/', { description: '编辑' })
  async edit(@Body(ALL) data: LoginLogDTO) {
    const loginLog = await this.loginLogService.getById(data.id);
    // update
    return await this.loginLogService.edit(loginLog);
  }

  @Del('/:id', { description: '删除' })
  async remove(@Param('id') id: string) {
    const loginLog = await this.loginLogService.getById(id);
    await this.loginLogService.remove(loginLog);
  }

  @Get('/:id', { description: '根据id查询' })
  async getById(@Param('id') id: string) {
    return await this.loginLogService.getById(id);
  }

  @Get('/page', { description: '分页查询' })
  async page(@Query() pageInfo: LoginLogPageDTO) {
    const query = new FilterQuery<LoginLogEntity>();
    query.append('userName', like(pageInfo.userName), !!pageInfo.userName);
    return await this.loginLogService.page(pageInfo, query);
  }

  @Get('/list', { description: '查询全部' })
  @ApiOkResponse({ type: LoginLogVO })
  async list() {
    return await this.loginLogService.list();
  }
}
