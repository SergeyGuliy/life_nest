import { Module } from '@nestjs/common';
import { SqlHelperController } from './sql-helper.controller';
import { SqlHelperService } from './sql-helper.service';
import { Users } from '../../plugins/database/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [SqlHelperController],
  providers: [SqlHelperService],
})
export class SqlHelperModule {}
