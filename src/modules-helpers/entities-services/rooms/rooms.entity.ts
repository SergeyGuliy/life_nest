import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@assets/base.entity';

import { ROOM_TYPES } from '@enums/index.js';
import { ObjectId } from 'mongoose';

@Entity('rooms')
export class Rooms extends BaseEntity {
  @PrimaryGeneratedColumn()
  public roomId: number;

  @Column()
  public roomName: string;

  @Column()
  public roomPassword: string;

  @Column({
    type: 'enum',
    enum: ROOM_TYPES,
  })
  public typeOfRoom: ROOM_TYPES;

  @Column()
  public minCountOfUsers: number;

  @Column()
  public maxCountOfUsers: number;

  @Column({
    default: false,
  })
  public isBlocked: boolean;

  @Column({
    default: null,
  })
  public creatorId: null | number;

  @Column({
    default: null,
  })
  public gameId: ObjectId;

  // @OneToOne(() => Users, (users) => users.createdRoomId)
  // public roomHostId: Users;
  // @OneToMany(() => Users, (users: Users) => users.roomJoinedId, {
  //   onDelete: 'SET NULL',
  // })
  // public usersInRoomsId: Users[];
}
