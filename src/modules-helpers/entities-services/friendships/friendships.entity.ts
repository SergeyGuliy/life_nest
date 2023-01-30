import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseEntity } from '../../../assets/base.entity.js';
import { Users } from '../users/users.entity.js';

import { FRIENDSHIP_STATUSES } from 'life_shared/enums/index.js';

@Entity('friendships')
export class Friendships extends BaseEntity {
  @PrimaryGeneratedColumn()
  public friendshipsId: number;

  @Column({
    type: 'enum',
    enum: FRIENDSHIP_STATUSES,
    default: FRIENDSHIP_STATUSES.PENDING,
  })
  public friendshipsStatus: FRIENDSHIP_STATUSES;

  @ManyToOne(() => Users, (user) => user.friendshipReceiver)
  @JoinColumn()
  public friendshipReceiver: Users;

  @ManyToOne(() => Users, (user) => user.friendshipSender)
  @JoinColumn()
  public friendshipSender: Users;
}
