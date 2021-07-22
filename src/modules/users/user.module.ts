import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Users } from '../../plugins/database/entities/users.entity';
import { EntityManagerModule } from '../../assets/entitiesManagers/entitiy-manager.module';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), EntityManagerModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
