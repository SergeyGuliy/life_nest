import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';

import { RoomTypes } from './enums';
import { Users } from './users.entity';

@Entity()
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

  @OneToOne((type) => Users, (user) => user.createdRoomId)
  public creatorId: Users;

  // @OneToOne(() => Users, (users) => users.userId)
  // @JoinColumn()
  // public roomHostId: string;
}
