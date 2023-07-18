export enum SocketMessageType {
  /**
   * 权限变更
   */
  PermissionChange = 'PermissionChange',
  /**
   * 密码重置
   */
  PasswordChange = 'PasswordChange',
  /**
   * token过期
   */
  TokenExpire = 'TokenExpire',
  /**
   * Ping
   */
  Ping = 'Ping',
  /**
   * PONG
   */
  Pong = 'Pong',
}

export class SocketMessage<T = any> {
  /**
   * 消息类型
   */
  type: SocketMessageType;
  /**
   * 消息内容
   */
  data?: T;
  constructor(type: SocketMessageType, data?: T) {
    this.type = type;
    this.data = data;
  }
}
