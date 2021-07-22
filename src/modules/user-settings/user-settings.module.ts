import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserSettingsController } from './user-settings.controller';
import { UserSettingsService } from './user-settings.service';
import { Users } from '../../plugins/database/entities/users.entity';
import { UserSettings } from '../../plugins/database/entities/users-settings.entity';
import { EntityManagerModule } from '../../assets/entitiesManagers/entitiy-manager.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, UserSettings]),
    EntityManagerModule,
  ],
  controllers: [UserSettingsController],
  providers: [UserSettingsService],
})
export class UserSettingsModule {}
