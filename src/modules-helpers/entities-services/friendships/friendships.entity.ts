import { Column, Entity, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from '../../../assets/base.entity.js';

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

  @JoinColumn()
  public friendshipReceiver: {
    userId: number;
  };

  @JoinColumn()
  public friendshipSender: {
    userId: number;
  };
}
