import { Module } from '@nestjs/common';

import { UploaderController } from './uploader.controller.js';
import { UploaderService } from './uploader.service.js';
import { EntityManagerModule } from '../entities-services/entitiy-manager.module.js';

@Module({
  imports: [EntityManagerModule],
  controllers: [UploaderController],
  providers: [UploaderService],
})
export class UploaderModule {}
