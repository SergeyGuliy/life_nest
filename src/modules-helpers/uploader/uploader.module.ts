import { Module } from '@nestjs/common';

import { UploaderController } from './uploader.controller';
import { UploaderService } from './uploader.service';
import { EntityManagerModule } from '../entities-services/entitiy-manager.module';

@Module({
  imports: [EntityManagerModule],
  controllers: [UploaderController],
  providers: [UploaderService],
})
export class UploaderModule {}
