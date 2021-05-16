import { Module } from '@nestjs/common';
import { SqlHelperController } from './sql-helper.controller';
import { SqlHelperService } from './sql-helper.service';
import { Users } from '../../plugins/database/entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rooms } from '../../plugins/database/entities/rooms.entity';
import { Messages } from '../../plugins/database/entities/messages.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Rooms, Messages])],
  controllers: [SqlHelperController],
  providers: [SqlHelperService],
})
export class SqlHelperModule {}
