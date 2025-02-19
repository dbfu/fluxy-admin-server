import { Autoload, Init, InjectClient, Singleton } from '@midwayjs/core';
import { RedisService, RedisServiceFactory } from '@midwayjs/redis';
import { Context } from '@midwayjs/ws';
import { SocketMessage } from '../type';

const socketChannel = 'socket-message';

@Singleton()
@Autoload()
export class SocketService {
  connects = new Map<string, Context[]>();
  @InjectClient(RedisServiceFactory, 'publish')
  publishRedisService: RedisService;
  @InjectClient(RedisServiceFactory, 'subscribe')
  subscribeRedisService: RedisService;

  @Init()
  async init() {
    // 系统启动的时候，这个方法会自动执行，监听频道。
    await this.subscribeRedisService.subscribe(socketChannel);

    // 如果接受到消息，通过userId获取连接，如果存在，通过连接给前端发消息
    this.subscribeRedisService.on(
      'message',
      (channel: string, message: string) => {
        if (channel === socketChannel && message) {
          const messageData = JSON.parse(message);

          const { userId, data } = messageData;
          const clients = this.connects.get(userId);

          if (clients?.length) {
            clients.forEach(client => {
              client.send(JSON.stringify(data));
            });
          }
        }
      }
    );
  }

  /**
   * 添加连接
   * @param userId 用户id
   * @param connect 用户socket连接
   */
  addConnect(userId: string, connect: Context) {
    const curConnects = this.connects.get(userId);
    if (curConnects) {
      curConnects.push(connect);
    } else {
      this.connects.set(userId, [connect]);
    }
  }

  /**
   * 删除连接
   * @param connect 用户socket连接
   */
  deleteConnect(connect: Context) {
    const connects = [...this.connects.values()];

    for (let i = 0; i < connects.length; i += 1) {
      const sockets = connects[i];
      const index = sockets.indexOf(connect);
      if (index >= 0) {
        sockets.splice(index, 1);
        break;
      }
    }
  }

  /**
   * 给指定用户发消息
   * @param userId 用户id
   * @param data 数据
   */
  sendMessage<T>(userId: string, data: SocketMessage<T>) {
    this.publishRedisService.publish(
      socketChannel,
      JSON.stringify({
        userId,
        data,
      })
    );
  }
}
