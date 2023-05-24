import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;
  @CreateDateColumn()
  create_time?: Date;
  @UpdateDateColumn()
  update_time?: Date;
}
