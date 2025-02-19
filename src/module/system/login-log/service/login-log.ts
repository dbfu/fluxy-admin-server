import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../../../common/base-service';
import { LoginLogEntity } from '../entity/login-log';

@Provide()
export class LoginLogService extends BaseService<LoginLogEntity> {
  @InjectEntityModel(LoginLogEntity)
  loginLogModel: Repository<LoginLogEntity>;

  getModel(): Repository<LoginLogEntity> {
    return this.loginLogModel;
  }
}
