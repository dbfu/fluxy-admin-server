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
import { RoleDTO } from '../dto/role';
import { RolePageDTO } from '../dto/role.page';
import { RoleService } from '../service/role';
import { RoleMenuDTO } from '../dto/role.menu';
import { R } from '../../../common/base.error.util';
import { FilterParams } from '../../../utils/filter-query';
import { RoleEntity } from '../entity/role';

@Provide()
@Controller('/role', { description: '角色管理' })
export class RoleController {
  @Inject()
  roleService: RoleService;

  @Get('/page', { description: '分页获取角色列表' })
  async page(@Query() rolePageDTO: RolePageDTO) {
    const query = new FilterParams<RoleEntity>();

    query
      .append('code', { $like: `%${rolePageDTO.code}%` }, !!rolePageDTO.code)
      .append('name', { $like: `%${rolePageDTO.name}%` }, !!rolePageDTO.name);

    return await this.roleService.getRolesByPage(rolePageDTO, query.where);
  }

  @Post('/', { description: '创建角色' })
  async create(@Body() data: RoleDTO) {
    return await this.roleService.createRole(data);
  }

  @Put('/', { description: '更新角色' })
  async update(@Body() data: RoleDTO) {
    return await this.roleService.updateRole(data);
  }

  @Del('/:id', { description: '删除角色' })
  async remove(
    @Param('id')
    id: string
  ) {
    if (!id) {
      throw R.validateError('id不能为空');
    }
    return await this.roleService.removeRole(id);
  }

  @Post('/alloc/menu', { description: '角色分配菜单' })
  async allocMenu(@Body() roleMenuDTO: RoleMenuDTO) {
    return await this.roleService.allocMenu(
      roleMenuDTO.roleId,
      roleMenuDTO.menuIds
    );
  }

  @Get('/list', { description: '获取角色列表' })
  async list() {
    return await this.roleService.list();
  }

  @Get('/menu/list', { description: '根据角色id获取菜单列表' })
  async getMenusByRoleId(@Query('id') id: string) {
    return (await this.roleService.getMenusByRoleId(id)).map(o => o.menuId);
  }
}
