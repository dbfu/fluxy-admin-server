import {
  CONTROLLER_KEY,
  Config,
  Inject,
  MidwayWebRouterService,
  Provide,
  RouterInfo,
  getClassMetadata,
  listModule,
} from '@midwayjs/core';

@Provide()
export class ApiService {
  @Config('koa')
  koaConfig: any;
  @Inject()
  webRouterService: MidwayWebRouterService;
  @Inject()
  notLoginRouters: RouterInfo[];
  @Inject()
  notAuthRouters: RouterInfo[];

  // 按contoller获取接口列表
  async getApiList() {
    // 获取所有contoller
    const controllerModules = listModule(CONTROLLER_KEY);

    const list = [];

    // 遍历contoller，获取controller的信息存到list数组中
    for (const module of controllerModules) {
      const controllerInfo = getClassMetadata(CONTROLLER_KEY, module) || [];
      list.push({
        title:
          controllerInfo?.routerOptions?.description || controllerInfo?.prefix,
        path: `${this.koaConfig.globalPrefix}${controllerInfo?.prefix}`,
        prefix: controllerInfo?.prefix,
        type: 'controller',
      });
    }

    // 获取所有接口
    let routes = await this.webRouterService.getFlattenRouterTable();

    // 把不用登录和鉴权的接口过滤掉
    routes = routes
      .filter(
        route =>
          !this.notLoginRouters.some(
            r => r.url === route.url && r.requestMethod === route.requestMethod
          )
      )
      .filter(
        route =>
          !this.notAuthRouters.some(
            r => r.url === route.url && r.requestMethod === route.requestMethod
          )
      );

    // 把接口按照controller分组
    const routesGroup = routes.reduce((prev, cur) => {
      if (prev[cur.prefix]) {
        prev[cur.prefix].push(cur);
      } else {
        prev[cur.prefix] = [cur];
      }
      return prev;
    }, {});

    // 返回controller和接口信息
    return list
      .map(item => {
        if (!routesGroup[item.path]?.length) {
          return null;
        }
        return {
          ...item,
          children: routesGroup[item.path]?.map(o => ({
            title: o.description || o.url,
            path: o.url,
            method: o.requestMethod,
            type: 'route',
          })),
        };
      })
      .filter(o => !!o);
  }
}
