import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './assets/database/typeorm-config';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';

import { SocketModule } from './sub_modules/socket/socket.module';
import { UploaderModule } from './sub_modules/uploader/uploader.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/user.module';
import { UserSettingsModule } from './modules/user-settings/user-settings.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { ChatsModule } from './modules/chats/chats.module';
import { FriendshipModule } from './modules/friendship/friendship.module';
import { GamesModule } from './modules/games/games.module';
import { SqlHelperModule } from './sub_modules/sql-helper/sql-helper.module';

export const setupMongoose = () => {
  return MongooseModule.forRoot('mongodb://root:example@mongo:27017/');
};

export const setupTypeOrm = () => {
  return TypeOrmModule.forRoot(typeormConfig);
};

export const setupConfigModule = () => {
  return ConfigModule.forRoot({
    envFilePath: '.env',
    isGlobal: true,
    validationSchema: Joi.object({
      POSTGRES_HOST: Joi.string().required(),
      POSTGRES_PORT: Joi.number().required(),
      POSTGRES_USER: Joi.string().required(),
      POSTGRES_PASSWORD: Joi.string().required(),
      POSTGRES_DB: Joi.string().required(),
      PORT: Joi.number(),
    }),
  });
};

export const setupDefaultModules = () => {
  const defaultModules = [
    SocketModule,
    UploaderModule,

    AuthModule,

    UserModule,
    UserSettingsModule,

    RoomsModule,
    ChatsModule,
    FriendshipModule,
    GamesModule,
  ];

  // Adding SqlHelperModule module only if mode is dev
  if (process.env.NODE_ENV === 'dev') defaultModules.push(SqlHelperModule);

  return defaultModules;
};
