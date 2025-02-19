import { Provide, Inject, Config, Scope, ScopeEnum } from '@midwayjs/core';
import { CacheManager } from '@midwayjs/cache';
import * as svgCaptcha from 'svg-captcha';
import * as svgBase64 from 'mini-svg-data-uri';
import { FormulaCaptchaOptions, CaptchaOptions } from '../interface';
import { uuid } from '../../../../utils/uuid';

@Provide()
@Scope(ScopeEnum.Singleton)
export class CaptchaService {
  @Inject()
  cacheManager: CacheManager;

  @Config('captcha')
  captcha: CaptchaOptions;

  async formula(options?: FormulaCaptchaOptions) {
    const { data, text } = svgCaptcha.createMathExpr(options);
    const id = await this.set(text);
    const imageBase64 = svgBase64(data);
    return { id, imageBase64 };
  }

  async set(text: string): Promise<string> {
    const id = uuid();
    await this.cacheManager.set(
      this.getStoreId(id),
      (text || '').toLowerCase(),
      { ttl: this.captcha.expirationTime }
    );
    return id;
  }

  async check(id: string, value: string): Promise<boolean> {
    if (!id || !value) {
      return false;
    }
    const storeId = this.getStoreId(id);
    const storedValue = await this.cacheManager.get(storeId);
    if (value.toLowerCase() !== storedValue) {
      return false;
    }
    this.cacheManager.del(storeId);
    return true;
  }

  private getStoreId(id: string): string {
    if (!this.captcha.idPrefix) {
      return id;
    }
    return `${this.captcha.idPrefix}:${id}`;
  }
}
