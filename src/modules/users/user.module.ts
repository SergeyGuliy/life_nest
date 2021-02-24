import { Module } from '@nestjs/common';
import PostsController from './user.controller';
import UserService from './user.service';
// import User from '../../database/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  // imports: [TypeOrmModule.forFeature([User])],
  controllers: [PostsController],
  providers: [UserService],
})
export class UserModule {}
