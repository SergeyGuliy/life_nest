import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Users } from './users.entity';
import { MessageReceiverTypes, MessageTypes } from '../enums';

@Entity('messages')
export class Messages extends BaseEntity {
  @PrimaryGeneratedColumn()
  public messageId: number;

  @Column({
    type: 'enum',
    enum: MessageReceiverTypes,
    default: MessageReceiverTypes.GLOBAL,
  })
  public messageReceiverType: MessageReceiverTypes;

  @Column({
    type: 'enum',
    enum: MessageTypes,
    default: MessageTypes.TEXT,
  })
  public messageType: MessageTypes;

  @ManyToOne(() => Users, (user) => user.messages)
  @JoinColumn()
  public messageSender: Users;

  @Column({ default: null })
  public messageReceiverRoomId: number;

  @Column({ default: null })
  public messageReceiverUserId: number;

  @Column({ default: null })
  public messageText: string;

  @Column({ default: null })
  public messageVoice: string;
}
