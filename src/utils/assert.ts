import { R } from '../common/base-error-util';

export class AssertUtils {
  public static notEmpty(value: any, message: string): void {
    if (value === null || value === undefined) throw R.error(message);
  }
  public static arrNotEmpty(arr: any[], message: string): void {
    if (!arr || arr.length === 0) throw R.error(message);
  }
  public static isTrue(condition: boolean, message: string): void {
    if (condition !== true) throw R.error(message);
  }
}
