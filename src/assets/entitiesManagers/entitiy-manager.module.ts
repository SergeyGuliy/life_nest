import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Users } from '../../plugins/database/entities/users.entity';
import { UserSettings } from '../../plugins/database/entities/users-settings.entity';
import { Messages } from '../../plugins/database/entities/messages.entity';
import { Friendships } from '../../plugins/database/entities/friendships.entity';
import { Rooms } from '../../plugins/database/entities/rooms.entity';

import { UserManagerService } from './users/user.service';
import { UserSettingsManagerService } from './users/user-settings.service';
import { ChatsManagerService } from './chats/chats.service';
import { FriendshipManagerService } from './friendship/friendship.service';
import { RoomsManagerService } from './rooms/rooms.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      UserSettings,
      Messages,
      Friendships,
      Rooms,
    ]),
  ],
  providers: [
    UserManagerService,
    RoomsManagerService,
    UserSettingsManagerService,
    ChatsManagerService,
    FriendshipManagerService,
  ],
  exports: [
    UserManagerService,
    RoomsManagerService,
    UserSettingsManagerService,
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
