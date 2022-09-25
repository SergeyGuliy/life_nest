import { Module } from '@nestjs/common';

import { UsersSettingsController } from './users-settings.controller';
import { UsersSettingsService } from './users-settings.service';
import { EntityManagerModule } from '@modules-helpers/entities-services/entitiy-manager.module';
import { GlobalServicesModule } from '@modules-helpers/global-services/global-services.module';

@Module({
  imports: [GlobalServicesModule, EntityManagerModule],
  controllers: [UsersSettingsController],
  providers: [UsersSettingsService],
})
export class UsersSettingsModule {}
