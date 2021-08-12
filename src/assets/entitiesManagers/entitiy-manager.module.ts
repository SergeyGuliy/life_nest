import { Module } from '@nestjs/common';
import { Users } from '../../plugins/database/entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserManagerService } from './users/user.service';
import { UserSettings } from '../../plugins/database/entities/users-settings.entity';
import { UserSettingsManagerService } from './users/user-settings.service';
import { Messages } from '../../plugins/database/entities/messages.entity';
import { ChatsManagerService } from './chats/chats.service';
import { Friendships } from '../../plugins/database/entities/friendships.entity';
import { FriendshipManagerService } from './friendship/friendship.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, UserSettings, Messages, Friendships]),
  ],
  providers: [
    UserManagerService,
    UserSettingsManagerService,
    ChatsManagerService,
    FriendshipManagerService,
  ],
  exports: [
    UserManagerService,
    UserSettingsManagerService,
    ChatsManagerService,
    FriendshipManagerService,
    TypeOrmModule.forFeature([Users, UserSettings, Messages, Friendships]),
  ],
})
export class EntityManagerModule {}
