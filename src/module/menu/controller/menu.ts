import {
  Body,
  Controller,
  Del,
  Get,
  Inject,
  Param,
  Post,
  Provide,
  Put,
  Query,
} from '@midwayjs/decorator';
import { R } from '../../../common/base.error.util';
import { NotLogin } from '../../../decorator/not.login';
import { MenuDTO } from '../dto/menu';
import { MenuVersionDTO } from '../dto/menu.version';
import { UpdateMenuVersionDTO } from '../dto/update.menu.version';
import { MenuService } from '../service/menu';

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

  @Get('/lowcode/menus/page', { description: '分页获取低代码页面' })
  async queryLowCodeMenus(
    @Query('page') page: number,
    @Query('size') size: number
  ) {
    return await this.menuService.queryLowCodeMenus(page, size);
  }

  @Get('/lowcode/version/:id', { description: '根据版本id获取版本信息' })
  async queryVersionById(@Param('id') id: string) {
    return await this.menuService.queryVersionById(id);
  }

  @Put('/lowcode/version', { description: '更新低代码页面配置' })
  async updateVersion(@Body() data: UpdateMenuVersionDTO) {
    return await this.menuService.updateVersion(data);
  }

  @Get('/lowcode/version/latest', { description: '获取最新版本' })
  async getLatestVersionByMenuId(@Query('menuId') menuId: string) {
    return await this.menuService.getLatestVersionByMenuId(menuId);
  }

  @Post('/lowcode/version', { description: '创建新版本' })
  async createNewVersion(@Body() data: MenuVersionDTO) {
    return await this.menuService.createNewVersion(data);
  }

  @Post('/lowcode/version/publish', { description: '发布版本' })
  async publishLowCodePage(@Body() data: any) {
    if (!data.menuId) {
      throw R.validateError('菜单id不能为空');
    }

    if (!data.version) {
      throw R.validateError('版本号不能为空');
    }

    return await this.menuService.publishLowCodePage(data.menuId, data.version);
  }
}
