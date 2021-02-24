import { Module } from '@nestjs/common';
import UserController from './user.controller';
import UserService from './user.service';
import User from '../../common/database/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
