import { MidwayValidationError } from '@midwayjs/validate';
import { CommonError } from './common.error';

export class R {
  static error(message: string) {
    return new CommonError(message);
  }

  static validateError(message: string) {
    return new MidwayValidationError(message, 422, null);
  }
}
