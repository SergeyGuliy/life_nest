import { Module } from '@nestjs/common';

import { UserSettingsController } from './user-settings.controller';
import { UserSettingsService } from './user-settings.service';
import { EntityManagerModule } from '../../assets/entitiesManagers/entitiy-manager.module';

@Module({
  imports: [EntityManagerModule],
  controllers: [UserSettingsController],
  providers: [UserSettingsService],
})
export class UserSettingsModule {}
