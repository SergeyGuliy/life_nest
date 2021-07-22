import { Module } from '@nestjs/common';
import { Users } from '../../plugins/database/entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserManagerService } from './users/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  providers: [UserManagerService],
  exports: [UserManagerService],
})
export class EntityManagerModule {}
