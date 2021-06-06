import { Module } from '@nestjs/common';
import { FriendshipController } from './friendship.controller';
import { FriendshipService } from './friendship.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friendships } from '../assets/database/entities/friendships.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Friendships])],
  controllers: [FriendshipController],
  providers: [FriendshipService],
  exports: [FriendshipService],
})
export class FriendshipModule {}
