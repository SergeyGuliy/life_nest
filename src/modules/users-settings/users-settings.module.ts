import { Module } from '@nestjs/common';

import { UsersSettingsController } from './users-settings.controller.js';
import { UsersSettingsService } from './users-settings.service.js';
import { EntityManagerModule } from '../../modules-helpers/entities-services/entitiy-manager.module.js';
import { GlobalServicesModule } from '../../modules-helpers/global-services/global-services.module.js';

@Module({
  imports: [GlobalServicesModule, EntityManagerModule],
  controllers: [UsersSettingsController],
  providers: [UsersSettingsService],
})
export class UsersSettingsModule {}
