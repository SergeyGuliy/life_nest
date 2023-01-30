import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Users } from './users/users.entity.js';
import { UserSettings } from './users-settings/users-settings.entity.js';
import { Messages } from './chats/messages.entity.js';
import { Friendships } from './friendships/friendships.entity.js';
import { Rooms } from './rooms/rooms.entity.js';

import { UsersManager } from './users/users.service.js';
import { UsersSettingsManager } from './users-settings/users-settings.service.js';
import { ChatsManager } from './chats/chats.service.js';
import { FriendshipManager } from './friendships/friendships.service.js';
import { RoomsManager } from './rooms/rooms.service.js';
import { GlobalServicesModule } from '../global-services/global-services.module.js';

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
