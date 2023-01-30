import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SqlHelperController } from './sql-helper.controller.js';
import { SqlHelperService } from './sql-helper.service.js';

import { Users } from '../entities-services/users/users.entity.js';
import { Rooms } from '../entities-services/rooms/rooms.entity.js';
import { Messages } from '../entities-services/chats/messages.entity.js';
import { Friendships } from '../entities-services/friendships/friendships.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Rooms, Messages, Friendships])],
  controllers: [SqlHelperController],
  providers: [SqlHelperService],
})
export class SqlHelperModule {}
