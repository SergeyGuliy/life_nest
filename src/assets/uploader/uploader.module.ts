import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UploaderController } from './uploader.controller';
import { UploaderService } from './uploader.service';
import { Users } from '../../plugins/database/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [UploaderController],
  providers: [UploaderService],
})
export class UploaderModule {}
