import { EventSubscriberModel } from '@midwayjs/typeorm';
import { EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { snowFlake } from './utils/snow.flake';

@EventSubscriberModel()
export class EverythingSubscriber implements EntitySubscriberInterface {
  beforeInsert(event: InsertEvent<any>) {
    if (!event.entity.id) {
      event.entity.id = snowFlake.nextId();
    }
  }
}
