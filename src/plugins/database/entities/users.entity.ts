import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRole } from './enums';
import { Rooms } from './rooms.entity';
import { BaseEntity } from './base.entity';

@Entity()
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

  @OneToOne((type) => Rooms, (room) => room.creatorId)
  @JoinColumn()
  public createdRoomId: Rooms;

  // @OneToOne(() => Rooms, (rooms) => rooms.roomHostId)
  // @JoinColumn()
  // public roomHostId: string;
}
