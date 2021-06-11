import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserGameStatus, UserOnlineStatus, UserRole } from '../enums';
import { Messages } from './messages.entity';
import { BaseEntity } from './base.entity';
import { Friendships } from './friendships.entity';

@Entity('user')
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn()
  public userId: number;

  @Column()
  public email: string;

  @Column()
  public phone: string;

  @Column({
    select: false,
  })
  public password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CASUAL,
  })
  public role: UserRole;

  @Column({
    type: 'enum',
    enum: UserOnlineStatus,
    default: UserOnlineStatus.OFFLINE,
  })
  public userOnlineStatus: UserOnlineStatus;

  @Column({
    type: 'enum',
    enum: UserGameStatus,
    default: UserGameStatus.NOT_IN_GAME,
  })
  public userGameStatus: UserGameStatus;

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
    select: false,
  })
  public refreshToken?: string;

  @Column({
    default: true,
  })
  public isDarkTheme?: boolean;

  @Column({
    default: null,
  })
  public createdRoomId: null | number;

  @OneToMany(() => Messages, (message) => message.messageSender)
  public messages: Messages[];

  @Column({
    default: null,
  })
  public roomJoinedId: null | number;

  @OneToMany(() => Friendships, (friendships) => friendships.friendshipReceiver)
  public friendshipReceiver: Friendships[];

  @OneToMany(() => Friendships, (friendships) => friendships.friendshipSender)
  public friendshipSender: Friendships[];

  // constructor(partial: Partial<Users>) {
  //   super();
  //   Object.assign(this, partial);
  // }
}
