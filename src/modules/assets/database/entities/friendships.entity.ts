import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { FriendshipStatuses } from '../enums';
import { Users } from './users.entity';

@Entity('friendships')
export class Friendships extends BaseEntity {
  @PrimaryGeneratedColumn()
  public friendshipsId: number;

  @Column({
    type: 'enum',
    enum: FriendshipStatuses,
    default: FriendshipStatuses.PENDING,
  })
  public friendshipsStatus: FriendshipStatuses;

  @ManyToOne(() => Users, (user) => user.messages)
  @JoinColumn()
  public friendshipReceiver: Users;

  @ManyToOne(() => Users, (user) => user.messages)
  @JoinColumn()
  public friendshipSender: Users;
}
