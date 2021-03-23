import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRole } from './enums';
import { Rooms } from './rooms.entity';
import { BaseEntity } from './base.entity';

@Entity('users')
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn()
  public userId: number;

  @Column()
  public email: string;

  @Column()
  public phone: string;

  // @Column()
  // public phoneCountryCode: string;

  @Column()
  public password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.GUEST,
  })
  public role: UserRole;

  @Column({
    default: null,
  })
  public firstName: string;

  @Column({
    default: null,
  })
  public lastName: string;

  @Column({
    default: null,
  })
  public country: string;

  @Column({
    default: null,
  })
  public refreshToken?: string;

  @Column({
    default: true,
  })
  public isDarkTheme?: boolean;

  // @OneToOne((type) => Rooms, (room) => room.creatorId)
  // @JoinColumn()
  // public createdRoomId: Rooms;

  @Column({
    default: null,
  })
  public createdRoomId: null | number;
  // @OneToOne(() => Rooms, (rooms) => rooms.roomHostId)
  // @JoinColumn()
  // public createdRoomId: Rooms;

  // @ManyToOne(() => Rooms, (rooms: Rooms) => rooms.usersInRoomsId, {
  //   onDelete: 'SET NULL',
  // })
  // public roomJoinedId: Rooms;

  @Column({
    default: null,
  })
  public roomJoinedId: null | number;
}
