import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseEntity } from '../../../assets/base.entity.js';
import { Users } from '../users/users.entity.js';

import {
  MESSAGE_RECEIVER_TYPES,
  MESSAGE_TYPES,
} from 'life_shared/enums/index.js';

@Entity('messages10')
export class Messages extends BaseEntity {
  @PrimaryGeneratedColumn()
  public messageId: number;

  @Column({
    type: 'enum',
    enum: MESSAGE_RECEIVER_TYPES,
    default: MESSAGE_RECEIVER_TYPES.GLOBAL,
  })
  public messageReceiverType: MESSAGE_RECEIVER_TYPES;

  @Column({
    type: 'enum',
    enum: MESSAGE_TYPES,
    default: MESSAGE_TYPES.TEXT,
  })
  public messageType: MESSAGE_TYPES;

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
