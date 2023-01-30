import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from '../../../assets/base.entity.js';

import { ROOM_TYPES } from 'life_shared/enums/index.js';

@Entity('rooms1')
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
    default: '',
  })
  public gameId: string;

  // @OneToOne(() => Users, (users) => users.createdRoomId)
  // public roomHostId: Users;
  // @OneToMany(() => Users, (users: Users) => users.roomJoinedId, {
  //   onDelete: 'SET NULL',
  // })
  // public usersInRoomsId: Users[];
}
