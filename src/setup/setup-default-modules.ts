import { SocketModule } from '../modules-helpers/socket/socket.module.js';
import { UploaderModule } from '../modules-helpers/uploader/uploader.module.js';
import { AuthModule } from '../modules/auth/auth.module.js';
import { UserModule } from '../modules/users/user.module.js';
import { UsersSettingsModule } from '../modules/users-settings/users-settings.module.js';
import { RoomsModule } from '../modules/rooms/rooms.module.js';
import { ChatsModule } from '../modules/chats/chats.module.js';
import { FriendshipsModule } from '../modules/friendships/friendships.module.js';
import { GamesModule } from '../modules/games/games.module.js';
import { SqlHelperModule } from '../modules-helpers/sql-helper/sql-helper.module.js';

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
