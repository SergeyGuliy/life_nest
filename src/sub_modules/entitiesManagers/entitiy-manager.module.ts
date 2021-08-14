import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Users } from '../../assets/database/entities/users.entity';
import { UserSettings } from '../../assets/database/entities/users-settings.entity';
import { Messages } from '../../assets/database/entities/messages.entity';
import { Friendships } from '../../assets/database/entities/friendships.entity';
import { Rooms } from '../../assets/database/entities/rooms.entity';

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
