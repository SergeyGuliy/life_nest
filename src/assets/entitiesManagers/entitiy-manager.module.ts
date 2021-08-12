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
import { RoomsManagerService } from './rooms/rooms.service';
import { Rooms } from '../../plugins/database/entities/rooms.entity';

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
