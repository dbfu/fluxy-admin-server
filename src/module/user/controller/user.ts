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
import { UserDTO } from '../dto/user';
import { UserService } from '../service/user';
import { FindOptionsWhere, Like } from 'typeorm';
import { UserEntity } from '../entity/user';

@Provide()
@Controller('/user')
export class UserController {
  @Inject()
  userService: UserService;

  @Post('/', { description: '新建' })
  async create(@Body(ALL) data: UserDTO) {
    return await this.userService.create(data.toEntity());
  }

  @Put('/', { description: '编辑' })
  async edit(@Body(ALL) data: UserDTO) {
    const user = await this.userService.getById(data.id);
    // update
    user.email = data.email;
    user.nickName = data.nickName;
    user.phoneNumber = data.phoneNumber;
    user.userName = data.userName;
    user.avatar = data.avatar;
    user.sex = data.sex;
    return await this.userService.edit(user);
  }

  @Del('/:id', { description: '删除' })
  async remove(@Param('id') id: number) {
    const user = await this.userService.getById(id);
    await this.userService.remove(user);
  }

  @Get('/:id', { description: '根据id查询' })
  async getById(@Param('id') id: number) {
    return await this.userService.getById(id);
  }

  @Get('/page', { description: '分页查询' })
  async page(
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('nickName') nickName: string,
    @Query('phoneNumber') phoneNumber: string
  ) {
    const query: FindOptionsWhere<UserEntity> = {};

    if (phoneNumber) {
      query.phoneNumber = Like(`%${phoneNumber}%`);
    }

    if (nickName) {
      query.nickName = Like(`%${nickName}%`);
    }

    return await this.userService.page(page, size, query);
  }

  @Get('/list', { description: '查询全部' })
  async list() {
    return await this.userService.list();
  }
}
