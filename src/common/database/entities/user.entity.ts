import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'ADMIN',
  GUEST = 'GUEST',
}

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column()
  public content: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.GUEST,
  })
  role: UserRole;
}
export default User;
