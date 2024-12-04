import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../../common/base.service';
import { LoginLogEntity } from '../entity/login.log';
import { EntityRepository } from '@mikro-orm/mysql';

@Provide()
export class LoginLogService extends BaseService<LoginLogEntity> {
  @InjectEntityModel(LoginLogEntity)
  loginLogModel: Repository<LoginLogEntity>;

  getModel(): EntityRepository<LoginLogEntity> {
    return this.getRepository(LoginLogEntity);
  }
}
