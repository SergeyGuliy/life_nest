import { Module } from '@nestjs/common';

import { UserSettingsController } from './user-settings.controller';
import { UserSettingsService } from './user-settings.service';
import { EntityManagerModule } from '../../sub_modules/entitiesManagers/entitiy-manager.module';
import { GlobalServicesModule } from '../../sub_modules/globalServices/global-services.module';

@Module({
  imports: [GlobalServicesModule, EntityManagerModule],
  controllers: [UserSettingsController],
  providers: [UserSettingsService],
})
export class UserSettingsModule {}
