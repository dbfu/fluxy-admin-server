import { ApiProperty } from '@midwayjs/swagger';
import { PageDTO } from '../../../../common/page-dto';

export class ApiLogPageDTO extends PageDTO {
  @ApiProperty({ description: '请求地址' })
  url?: string;

  @ApiProperty({ description: '请求方式' })
  method?: string;

  @ApiProperty({ description: '是否成功' })
  success?: boolean;

  @ApiProperty({ description: '请求开始时间起始时间' })
  startTimeStart?: Date;

  @ApiProperty({ description: '请求开始时间结束时间' })
  startTimeEnd?: Date;

  @ApiProperty({ description: '请求结束时间起始时间' })
  endTimeStart?: Date;

  @ApiProperty({ description: '请求结束时间结束时间' })
  endTimeEnd?: Date;

  @ApiProperty({ description: '耗时开始' })
  durationStart?: number;

  @ApiProperty({ description: '耗时结束' })
  durationEnd?: number;

  @ApiProperty({ description: '请求IP' })
  ip?: string;

  @ApiProperty({ description: '错误码' })
  errorType?: string;
}
