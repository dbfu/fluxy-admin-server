import {
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
import { PageDTO } from '../../../../common/page-dto';
import { AssertUtils } from '../../../../utils/assert';
import { MenuDTO } from '../dto/menu';
import { MenuEntity } from '../entity/menu';
import { MenuApiEntity } from '../entity/menu-api';
import { MenuService } from '../service/menu';
import { MenuVO } from '../vo/menu';
import { MenuPageVO } from '../vo/menu-page';

@Controller('/menu', { description: '菜单管理' })
export class MenuController {
  @Inject()
  menuService: MenuService;

  @Get('/page', { description: '分页查询菜单' })
  @ApiOkResponse({
    type: MenuPageVO,
  })
  async page(@Query() pageInfo: PageDTO) {
    return await this.menuService.getMenusByPage(pageInfo);
  }

  @Get('/children', { description: '根据上级菜单查询子级菜单' })
  @ApiOkResponse({
    type: MenuVO,
    isArray: true,
  })
  async children(@Query('parentId') parentId: string) {
    return await this.menuService.getChildren(parentId);
  }

  @Post('/', { description: '创建一个菜单' })
  async create(@Body() data: MenuDTO) {
    return await this.menuService.createMenu(data);
  }

  @Put('/', { description: '更新菜单' })
  @ApiOkResponse({
    type: MenuEntity,
  })
  async update(@Body() data: MenuDTO) {
    return await this.menuService.updateMenu(data);
  }

  @Del('/:id', { description: '删除一个菜单' })
  async remove(
    @Param('id')
    id: string
  ) {
    AssertUtils.notEmpty(id, 'id不能为空');
    return await this.menuService.removeMenu(id);
  }

  @Get('/alloc/api/list', { description: '根据菜单查询已分配接口' })
  @ApiOkResponse({
    type: MenuApiEntity,
    isArray: true,
  })
  async getAllocAPIByMenu(@Query('menuId') menuId: string) {
    return await this.menuService.getAllocAPIByMenu(menuId);
  }

  @ApiOkResponse({
    type: MenuVO,
    isArray: true,
  })
  @Get('/list', { description: '查询全量菜单' })
  async list() {
    return await this.menuService.list();
  }
}
