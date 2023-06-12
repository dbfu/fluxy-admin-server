import '@midwayjs/core';

interface UserContext {
  userId: number;
  refreshToken: string;
}

declare module '@midwayjs/core' {
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
