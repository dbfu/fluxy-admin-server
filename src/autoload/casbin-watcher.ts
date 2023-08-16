import { IMidwayContainer, Inject, Singleton } from '@midwayjs/core';
import { ApplicationContext, Autoload, Init } from '@midwayjs/decorator';

import { createWatcher } from '@midwayjs/casbin-redis-adapter';
import { CasbinEnforcerService } from '@midwayjs/casbin';

@Autoload()
@Singleton()
export class MinioAutoLoad {
  @ApplicationContext()
  applicationContext: IMidwayContainer;
  @Inject()
  casbinEnforcerService: CasbinEnforcerService;

  @Init()
  async init() {
    const casbinWatcher = await createWatcher({
      pubClientName: 'node-casbin-official',
      subClientName: 'node-casbin-sub',
    })(this.applicationContext);

    this.casbinEnforcerService.setWatcher(casbinWatcher);
    this.applicationContext.registerObject('casbinWatcher', casbinWatcher);
  }
}
