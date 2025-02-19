import { MidwayError } from '@midwayjs/core';

export class CommonError extends MidwayError {
  constructor(message: string) {
    super(message);
  }
}
