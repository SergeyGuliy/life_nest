import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SqlHelperController } from './sql-helper.controller';
import { SqlHelperService } from './sql-helper.service';

import { Users } from '../entities-services/users/users.entity';
import { Rooms } from '../entities-services/rooms/rooms.entity';
import { Messages } from '../entities-services/chats/messages.entity';
import { Friendships } from '../entities-services/friendships/friendships.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Rooms, Messages, Friendships])],
  controllers: [SqlHelperController],
  providers: [SqlHelperService],
})
export class SqlHelperModule {}




