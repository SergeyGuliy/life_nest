import { Module } from '@nestjs/common';
import { Users } from '../../plugins/database/entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserManagerService } from './users/user.service';
import { UserSettings } from '../../plugins/database/entities/users-settings.entity';
import { UserSettingsManagerService } from './users/user-settings.service';
import { Messages } from '../../plugins/database/entities/messages.entity';
import { ChatsManagerService } from './chats/chats.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users, UserSettings, Messages])],
  providers: [
    UserManagerService,
    UserSettingsManagerService,
    ChatsManagerService,
  ],
  exports: [
    UserManagerService,
    UserSettingsManagerService,
    ChatsManagerService,
  ],
})
export class EntityManagerModule {}
