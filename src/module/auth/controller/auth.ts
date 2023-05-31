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
import { AuthDTO } from '../dto/auth';
import { AuthService } from '../service/auth';

@Provide()
@Controller('/auth')
export class AuthController {
  @Inject()
  authService: AuthService;

  @Post('/', { description: '新建' })
  async create(@Body(ALL) data: AuthDTO) {
    return await this.authService.create(data.toEntity());
  }

  @Put('/', { description: '编辑' })
  async edit(@Body(ALL) data: AuthDTO) {
    const auth = await this.authService.getById(data.id);
    // update
    return await this.authService.edit(auth);
  }

  @Del('/:id', { description: '删除' })
  async remove(@Param('id') id: number) {
    const auth = await this.authService.getById(id);
    await this.authService.remove(auth);
  }

  @Get('/:id', { description: '根据id查询' })
  async getById(@Param('id') id: number) {
    return await this.authService.getById(id);
  }

  @Get('/page', { description: '分页查询' })
  async page(@Query('page') page: number, @Query('size') size: number) {
    return await this.authService.page(page, size);
  }

  @Get('/list', { description: '查询全部' })
  async list() {
    return await this.authService.list();
  }
}
