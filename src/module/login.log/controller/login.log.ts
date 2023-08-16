import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Provide,
  Query,
  ALL,
  Put,
  Param,
  Del,
} from '@midwayjs/decorator';
import { LoginLogDTO } from '../dto/login.log';
import { LoginLogService } from '../service/login.log';
import { FindOptionsWhere, Like } from 'typeorm';
import { LoginLogEntity } from '../entity/login.log';

@Provide()
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
  async page(
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('userName') userName?: string
  ) {
    let query = {};
    if (userName) {
      query = {
        userName: Like(`%${userName}%`),
      } as FindOptionsWhere<LoginLogEntity>;
    }

    return await this.loginLogService.page(page, size, query);
  }

  @Get('/list', { description: '查询全部' })
  async list() {
    return await this.loginLogService.list();
  }
}
