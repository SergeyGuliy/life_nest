import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Messages } from '../chats/messages.entity.js';
import { BaseEntity } from '../../../assets/base.entity.js';
import { Friendships } from '../friendships/friendships.entity.js';
import { UserSettings } from '../users-settings/users-settings.entity.js';

import {
  USER_ROLES,
  USER_GAME_STATUSES,
  USER_ONLINE_STATUSES,
} from 'life_shared/enums/index.js';

@Entity('users')
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
    default: '',
  })
  public avatarSmall: string;

  @Column({
    default: '',
  })
  public avatarBig: string;

  @Column({
    type: 'enum',
    enum: USER_ROLES,
    default: USER_ROLES.CASUAL,
  })
  public role: USER_ROLES;

  @Column({
    type: 'enum',
    enum: USER_ONLINE_STATUSES,
    default: USER_ONLINE_STATUSES.OFFLINE,
  })
  public userOnlineStatus: USER_ONLINE_STATUSES;

  @Column({
    type: 'enum',
    enum: USER_GAME_STATUSES,
    default: USER_GAME_STATUSES.NOT_IN_GAME,
  })
  public userGameStatus: USER_GAME_STATUSES;

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
    default: null,
  })
  public roomCreatedId: null | number;

  @OneToMany(() => Messages, (message: any) => message.messageSender)
  public messages: Messages[];

  @Column({
    default: null,
  })
  public roomJoinedId: null | number;

  @OneToMany(
    () => Friendships,
    (friendships: any) => friendships.friendshipReceiver,
  )
  public friendshipReceiver: Friendships[];

  @OneToMany(
    () => Friendships,
    (friendships: any) => friendships.friendshipSender,
  )
  public friendshipSender: Friendships[];

  @OneToOne(() => UserSettings)
  @JoinColumn()
  userSettings: UserSettings;
}
