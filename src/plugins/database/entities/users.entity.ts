import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserRole } from './enums';
import { Messages } from './messages.entity';
import { BaseEntity } from './base.entity';

@Entity('users')
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn()
  public userId: number;

  @Column()
  public email: string;

  @Column()
  public phone: string;

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

  constructor(partial: Partial<Users>) {
    super();
    Object.assign(this, partial);
  }
}
