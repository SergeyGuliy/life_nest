import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SqlHelperController } from './sql-helper.controller';
import { SqlHelperService } from './sql-helper.service';

import { Users } from '../../assets/database/entities-postgres/users.entity';
import { Rooms } from '../../assets/database/entities-postgres/rooms.entity';
import { Messages } from '../../assets/database/entities-postgres/messages.entity';
import { Friendships } from '../../assets/database/entities-postgres/friendships.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Rooms, Messages, Friendships])],
  controllers: [SqlHelperController],
  providers: [SqlHelperService],
})
export class SqlHelperModule {}
