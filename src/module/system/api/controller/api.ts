import { Controller, Get, Inject } from '@midwayjs/decorator';
import { ApiOkResponse } from '@midwayjs/swagger';
import { ApiService } from '../service/api';
import { ApiPageVo } from '../vo/api-page';

@Controller('/api', { description: '接口管理' })
export class ApiController {
  @Inject()
  apiService: ApiService;

  @Get('/list', { description: '获取接口列表' })
  @ApiOkResponse({ type: ApiPageVo })
  async apiList() {
    return await this.apiService.getApiList();
  }
}
