import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { RoomTypes } from './enums';
import { Users } from './users.entity';

@Entity()
export class Rooms {
  @PrimaryGeneratedColumn()
  public roomId: number;

  @Column()
  public email: string;

  @Column()
  public isPublic: boolean;

  @Column()
  public roomPassword: string;

  @Column()
  public password: string;

  @Column()
  public role: RoomTypes;

  // @OneToOne(() => Users, (users) => users.userId)
  // @JoinColumn()
  // public roomHostId: string;

  @Column({
    default: null,
  })
  public lastName: string;

  @Column({
    default: null,
  })
  public country: string;
}
