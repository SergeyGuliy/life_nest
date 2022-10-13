import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Users } from './users/users.entity';
import { UserSettings } from './users-settings/users-settings.entity';
import { Messages } from './chats/messages.entity';
import { Friendships } from './friendships/friendships.entity';
import { Rooms } from './rooms/rooms.entity';

import { UsersManager } from './users/users.service';
import { UsersSettingsManager } from './users-settings/users-settings.service';
import { ChatsManager } from './chats/chats.service';
import { FriendshipManager } from './friendships/friendships.service';
import { RoomsManager } from './rooms/rooms.service';
import { GlobalServicesModule } from '../global-services/global-services.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      UserSettings,
      Messages,
      Friendships,
      Rooms,
    ]),
    GlobalServicesModule,
  ],
  providers: [
    UsersManager,
    RoomsManager,
    UsersSettingsManager,
    ChatsManager,
    FriendshipManager,
  ],
  exports: [
    UsersManager,
    RoomsManager,
    UsersSettingsManager,
    ChatsManager,
    FriendshipManager,
    TypeOrmModule.forFeature([
      Users,
      UserSettings,
      Messages,
      Friendships,
      Rooms,
    ]),
  ],
})
export class EntityManagerModule {}
