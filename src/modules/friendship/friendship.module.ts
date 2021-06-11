import { Module } from '@nestjs/common';
import { FriendshipController } from './friendship.controller';
import { FriendshipService } from './friendship.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friendships } from '../assets/database/entities/friendships.entity';
import { Users } from '../assets/database/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Friendships, Users])],
  controllers: [FriendshipController],
  providers: [FriendshipService],
  exports: [FriendshipService],
})
export class FriendshipModule {}
