import { Controller, Get, Inject, Provide } from '@midwayjs/decorator';
import { ApiService } from '../service/api';

@Provide()
@Controller('/api', { description: '接口管理' })
export class ApiController {
  @Inject()
  apiService: ApiService;

  @Get('/list', { description: '获取接口列表' })
  async apiList() {
    return await this.apiService.getApiList();
  }
}
