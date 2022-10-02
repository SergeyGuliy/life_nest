import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Users } from './users/users.entity';
import { UserSettings } from './users-settings/users-settings.entity';
import { Messages } from './chats/messages.entity';
import { Friendships } from './friendships/friendships.entity';
import { Rooms } from './rooms/rooms.entity';

import { UsersManagerService } from './users/users.service';
import { UsersSettingsManagerService } from './users-settings/users-settings.service';
import { ChatsManagerService } from './chats/chats.service';
import { FriendshipManagerService } from './friendships/friendships.service';
import { RoomsManagerService } from './rooms/rooms.service';
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
    UsersManagerService,
    RoomsManagerService,
    UsersSettingsManagerService,
    ChatsManagerService,
    FriendshipManagerService,
  ],
  exports: [
    UsersManagerService,
    RoomsManagerService,
    UsersSettingsManagerService,
    ChatsManagerService,
    FriendshipManagerService,
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