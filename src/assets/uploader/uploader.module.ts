import { Module } from '@nestjs/common';
import { UploaderController } from './uploader.controller';
import { UploaderService } from './uploader.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../../plugins/database/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [UploaderController],
  providers: [UploaderService],
})
export class UploaderModule {}
