import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('messages')
export class Messages extends BaseEntity {
  @PrimaryGeneratedColumn()
  public messageId: number;

  @Column()
  public messageSenderId: string;

  @Column()
  public messageReceiver: string;
}
