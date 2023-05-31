import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../../common/base.service';
import { AuthEntity } from '../entity/auth';

@Provide()
export class AuthService extends BaseService<AuthEntity> {
  @InjectEntityModel(AuthEntity)
  authModel: Repository<AuthEntity>;

  getModel(): Repository<AuthEntity> {
    return this.authModel;
  }
}
