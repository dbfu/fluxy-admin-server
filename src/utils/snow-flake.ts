import { env } from 'process';

export class SnowFlake {
  // 系统上线的时间戳，我这里设置为 2023-06-22 00:00:00 的时间戳
  epoch = BigInt(1687392000000);

  // 数据中心的位数
  dataCenterIdBits = 5;
  // 机器id的位数
  workerIdBits = 5;
  // 自增序列号的位数
  sequenceBits = 12;

  // 最大的数据中心id 这段位运算可以理解为2^5-1 = 31
  maxDataCenterId = (BigInt(1) << BigInt(this.workerIdBits)) - BigInt(1);
  // 最大的机器id 这段位运算可以理解为2^5-1 = 31
  maxWorkerId = (BigInt(1) << BigInt(this.workerIdBits)) - BigInt(1);

  // 时间戳偏移位数
  timestampShift = BigInt(
    this.dataCenterIdBits + this.workerIdBits + this.sequenceBits
  );

  // 数据中心偏移位数
  dataCenterIdShift = BigInt(this.workerIdBits + this.sequenceBits);
  // 机器id偏移位数
  workerIdShift = BigInt(this.sequenceBits);
  // 自增序列号的掩码
  sequenceMask = (BigInt(1) << BigInt(this.sequenceBits)) - BigInt(1);
  // 记录上次生成id的时间戳
  lastTimestamp = BigInt(-1);
  // 数据中心id
  dataCenterId = BigInt(0);
  // 机器id
  workerId = BigInt(0);
  // 自增序列号
  sequence = BigInt(0);
  constructor(dataCenterId: number, workerId: number) {
    // 校验数据中心 ID 和工作节点 ID 的范围
    if (dataCenterId > this.maxDataCenterId || dataCenterId < 0) {
      throw new Error(
        `Data center ID must be between 0 and ${this.maxDataCenterId}`
      );
    }

    if (workerId > this.maxWorkerId || workerId < 0) {
      throw new Error(`Worker ID must be between 0 and ${this.maxWorkerId}`);
    }

    this.dataCenterId = BigInt(dataCenterId);
    this.workerId = BigInt(workerId);
  }

  nextId() {
    let timestamp = BigInt(Date.now());
    // 如果上一次生成id的时间戳比下一次生成的还大，说明服务器时间有问题，出现了回退，这时候再生成id，可能会生成重复的id，所以直接抛出异常。
    if (timestamp < this.lastTimestamp) {
      // 时钟回拨，抛出异常并拒绝生成 ID
      throw new Error('Clock moved backwards. Refusing to generate ID.');
    }

    // 如果当前时间戳和上一次的时间戳相等，序列号加一
    if (timestamp === this.lastTimestamp) {
      // 同一毫秒内生成多个 ID，递增序列号，防止冲突
      this.sequence = (this.sequence + BigInt(1)) & this.sequenceMask;
      if (this.sequence === BigInt(0)) {
        // 序列号溢出，等待下一毫秒
        timestamp = this.waitNextMillis(this.lastTimestamp);
      }
    } else {
      // 不同毫秒，重置序列号
      this.sequence = BigInt(0);
    }

    this.lastTimestamp = timestamp;

    // 组合各部分生成最终的 ID，可以理解为把64位二进制转换位十进制数字
    const id =
      ((timestamp - this.epoch) << this.timestampShift) |
      (this.dataCenterId << this.dataCenterIdShift) |
      (this.workerId << this.workerIdShift) |
      this.sequence;

    return id.toString();
  }

  waitNextMillis(lastTimestamp) {
    let timestamp = BigInt(Date.now());
    while (timestamp <= lastTimestamp) {
      // 主动等待，直到当前时间超过上次记录的时间戳
      timestamp = BigInt(Date.now());
    }
    return timestamp;
  }
}

export const snowFlake = new SnowFlake(0, +env.pm_id || 0);
