import { MidwayValidationError } from '@midwayjs/validate';
import { CommonError } from './common.error';
import { httpError } from '@midwayjs/core';

export class R {
  static error(message: string) {
    return new CommonError(message);
  }

  static validateError(message: string) {
    return new MidwayValidationError(message, 422, null);
  }

  static unauthorizedError(message: string) {
    return new httpError.UnauthorizedError(message);
  }

  static forbiddenError(message: string) {
    return new httpError.ForbiddenError(message);
  }
}
