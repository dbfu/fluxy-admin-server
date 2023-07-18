import {
  WSController,
  OnWSConnection,
  Inject,
  OnWSMessage,
  OnWSDisConnection,
} from '@midwayjs/core';
import { RedisService } from '@midwayjs/redis';
import { Context } from '@midwayjs/ws';
import * as http from 'http';
import { SocketService } from './service';
import { SocketMessageType, SocketMessage } from './message';

@WSController()
export class SocketConnectController {
  @Inject()
  ctx: Context;
  @Inject()
  redisService: RedisService;
  @Inject()
  socketService: SocketService;

  @OnWSConnection()
  async onConnectionMethod(socket: Context, request: http.IncomingMessage) {
    // 获取url上token参数
    const token = new URLSearchParams(request.url.split('?').pop()).get(
      'token'
    );

    if (!token) {
      socket.close();
      return;
    }

    const userInfoStr = await this.redisService.get(`token:${token}`);
    if (!userInfoStr) {
      socket.send(
        JSON.stringify({
          type: SocketMessageType.TokenExpire,
        })
      );
      socket.close();
      return;
    }

    const userInfo = JSON.parse(userInfoStr);
    this.socketService.addConnect(userInfo.userId, socket);
  }

  @OnWSMessage('message')
  async gotMessage(data: Buffer) {
    // 接受前端发送过来的消息
    try {
      const message = JSON.parse(data.toString()) as SocketMessage;
      // 如果前端发送过来的消息时ping，那么就返回pong给前端
      if (message.type === SocketMessageType.Ping) {
        return {
          type: SocketMessageType.Pong,
        };
      }
    } catch {
      console.error('json parse error');
    }
  }

  @OnWSDisConnection()
  async disconnect() {
    // 客户端断开连接后，从全局connects移除
    this.socketService.deleteConnect(this.ctx);
  }
}
