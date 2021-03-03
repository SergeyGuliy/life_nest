import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';

export enum UserRole {
  ADMIN = 'ADMIN',
  GUEST = 'GUEST',
}

@Entity()
class Users {
  @PrimaryGeneratedColumn()
  public id: number;

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
}
export default Users;
