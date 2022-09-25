import { SocketModule } from '@modules-helpers/socket/socket.module';
import { UploaderModule } from '@modules-helpers/uploader/uploader.module';
import { AuthModule } from '@modules/auth/auth.module';
import { UserModule } from '@modules/users/user.module';
import { UsersSettingsModule } from '@modules/users-settings/users-settings.module';
import { RoomsModule } from '@modules/rooms/rooms.module';
import { ChatsModule } from '@modules/chats/chats.module';
import { FriendshipsModule } from '@modules/friendships/friendships.module';
import { GamesModule } from '@modules/games/games.module';
import { SqlHelperModule } from '@modules-helpers/sql-helper/sql-helper.module';

export const setupDefaultModules = () => {
  const defaultModules = [
    SocketModule,
    UploaderModule,

    AuthModule,

    UserModule,
    UsersSettingsModule,

    RoomsModule,
    ChatsModule,
    FriendshipsModule,
    GamesModule,
  ];

  // Adding SqlHelperModule module only if mode is dev
  if (process.env.NODE_ENV === 'dev') defaultModules.push(SqlHelperModule);

  return defaultModules;
};
