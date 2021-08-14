import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SqlHelperController } from './sql-helper.controller';
import { SqlHelperService } from './sql-helper.service';

import { Users } from '../../plugins/database/entities/users.entity';
import { Rooms } from '../../plugins/database/entities/rooms.entity';
import { Messages } from '../../plugins/database/entities/messages.entity';
import { Friendships } from '../../plugins/database/entities/friendships.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Rooms, Messages, Friendships])],
  controllers: [SqlHelperController],
  providers: [SqlHelperService],
})
export class SqlHelperModule {}
