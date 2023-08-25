import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Provide,
  Query,
  Del,
  Param,
  Put,
} from '@midwayjs/decorator';
import { NotLogin } from '../../../decorator/not.login';
import { MenuDTO } from '../dto/menu';
import { MenuService } from '../service/menu';
import { R } from '../../../common/base.error.util';
import { RuleType, Valid } from '@midwayjs/validate';

@Provide()
@Controller('/menu', { description: '菜单管理' })
export class MenuController {
  @Inject()
  menuService: MenuService;

  @Post('/', { description: '创建一个菜单' })
  async create(@Body() data: MenuDTO) {
    return await this.menuService.createMenu(data);
  }

  @Del('/:id', { description: '删除一个菜单' })
  async remove(
    @Param('id')
    id: string
  ) {
    if (!id) {
      throw R.validateError('id不能为空');
    }
    return await this.menuService.removeMenu(id);
  }

  @Put('/', { description: '更新菜单' })
  async update(@Body() data: MenuDTO) {
    return await this.menuService.editMenu(data);
  }

  @Get('/page', { description: '分页查询菜单' })
  async page(@Query('page') page: number, @Query('size') size: number) {
    return await this.menuService.page(page, size);
  }

  @Get('/list', { description: '查询全量菜单' })
  @NotLogin()
  async list() {
    return await this.menuService.list();
  }

  @Get('/children', { description: '根据上级菜单查询子级菜单' })
  async children(@Query('parentId') parentId: string) {
    return await this.menuService.getChildren(parentId);
  }

  @Get('/alloc/interface/list', { description: '根据菜单查询已分配接口' })
  async getAllocInterfaceByMenu(@Query('menuId') menuId: string) {
    return await this.menuService.getAllocInterfaceByMenu(menuId);
  }
}
