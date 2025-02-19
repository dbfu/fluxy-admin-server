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
import { AssertUtils } from '../../../../utils/assert';
import { FilterQuery } from '../../../../utils/filter-query';
import { like } from '../../../../utils/typeorm-utils';
import { RoleDTO } from '../dto/role';
import { RoleMenuDTO } from '../dto/role-menu';
import { RolePageDTO } from '../dto/role-page';
import { RoleEntity } from '../entity/role';
import { RoleService } from '../service/role';
import { RolePageVO } from '../vo/role-page';

@Controller('/role', { description: '角色管理', tagName: 'sys' })
export class RoleController {
  @Inject()
  roleService: RoleService;

  @Get('/page', { description: '分页获取角色列表' })
  @ApiOkResponse({
    type: RolePageVO,
  })
  async page(@Query() rolePageDTO: RolePageDTO) {
    const filterQuery = new FilterQuery<RoleEntity>();
    const { name, code } = rolePageDTO;

    filterQuery
      .append('name', like(name), !!name)
      .append('code', like(code), !!code);

    return await this.roleService.page(rolePageDTO, {
      where: filterQuery.where,
      order: { createDate: 'DESC' },
    });
  }

  @Post('/', { description: '创建角色' })
  @ApiOkResponse({
    type: RoleEntity,
  })
  async create(@Body() data: RoleDTO) {
    return await this.roleService.createRole(data);
  }

  @Put('/', { description: '更新角色' })
  @ApiOkResponse({
    type: RoleEntity,
  })
  async update(@Body() data: RoleDTO) {
    return await this.roleService.editRole(data);
  }

  @Del('/:id', { description: '删除角色' })
  async remove(
    @Param('id')
    id: string
  ) {
    AssertUtils.notEmpty(id, 'id不能为空');
    return await this.roleService.removeRole(id);
  }

  @Post('/alloc/menu', { description: '角色分配菜单' })
  async allocMenu(@Body() roleMenuDTO: RoleMenuDTO) {
    return await this.roleService.allocMenu(
      roleMenuDTO.roleId,
      roleMenuDTO.menuIds
    );
  }

  @Get('/menu/list', { description: '根据角色id获取菜单id列表' })
  @ApiOkResponse({
    type: String,
    isArray: true,
  })
  async getMenusByRoleId(@Query('id') id: string) {
    return (await this.roleService.getMenusByRoleId(id)).map(o => o.menuId);
  }

  @Get('/list', { description: '分页获取角色列表' })
  @ApiOkResponse({ type: RoleEntity, isArray: true })
  async list() {
    return await this.roleService.list();
  }
}
