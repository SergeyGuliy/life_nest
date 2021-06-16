import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { USER_GAME_STATUSES, USER_ONLINE_STATUSES, USER_ROLES } from '../enums';
import { Messages } from './messages.entity';
import { BaseEntity } from './base.entity';
import { Friendships } from './friendships.entity';

@Entity('userSettings')
export class UserSettings extends BaseEntity {
  @PrimaryGeneratedColumn()
  public userSettingsId: number;

  @Column({
    type: 'enum',
    enum: USER_GAME_STATUSES,
    default: USER_GAME_STATUSES.NOT_IN_GAME,
  })
  public userGameStatus: USER_GAME_STATUSES;

  @Column({
    default: true,
  })
  public isDarkTheme?: boolean;
}
