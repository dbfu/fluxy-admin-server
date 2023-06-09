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
