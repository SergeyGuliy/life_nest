import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';

import { RoomTypes } from '../enums';
import { Users } from './users.entity';

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
    enum: RoomTypes,
  })
  public typeOfRoom: RoomTypes;

  @Column()
  public minCountOfUsers: number;

  @Column()
  public maxCountOfUsers: number;

  @Column({
    default: null,
  })
  public creatorId: null | number;

  // @OneToOne(() => Users, (users) => users.createdRoomId)
  // public roomHostId: Users;
  // @OneToMany(() => Users, (users: Users) => users.roomJoinedId, {
  //   onDelete: 'SET NULL',
  // })
  // public usersInRoomsId: Users[];
}
