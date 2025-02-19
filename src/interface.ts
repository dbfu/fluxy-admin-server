import '@midwayjs/core';

interface UserContext {
  userId: string;
  refreshToken: string;
}

declare module '@midwayjs/core' {
  interface Context {
    userInfo: UserContext;
    token: string;
    requestStartTime: Date;
  }
}

declare module 'koa' {
  interface Context {
    userInfo: UserContext;
    token: string;
  }
}

export interface MinioConfig {
  endPoint: string;
  port: number;
  useSSL: boolean;
  accessKey: string;
  secretKey: string;
  bucketName: string;
}

export interface MailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface TokenConfig {
  expire: number;
  refreshExpire: number;
}
