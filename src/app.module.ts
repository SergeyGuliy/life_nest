import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { MongooseModule } = require('@nestjs/mongoose');

import * as Joi from '@hapi/joi';

// import { SentryModule } from '@ntegral/nestjs-sentry';
// import { LogLevel } from '@sentry/types';

import { typeormConfig } from './assets/database/typeorm-config';
import { SqlHelperModule } from './sub_modules/sql-helper/sql-helper.module';

import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { ChatsModule } from './modules/chats/chats.module';
import { SocketModule } from './sub_modules/socket/socket.module';
import { UploaderModule } from './sub_modules/uploader/uploader.module';
import { FriendshipModule } from './modules/friendship/friendship.module';
import { UserSettingsModule } from './modules/user-settings/user-settings.module';
import { GameModule } from './modules/game/game.module';

import { MyLogger } from './sub_modules/globalServices/my-logger.service';

console.log(`Started in ${process.env.NODE_ENV} mode.`);

const defaultModules = [
  RoomsModule,
  ChatsModule,
  AuthModule,
  UserModule,
  UserSettingsModule,
  SocketModule,
  UploaderModule,
  FriendshipModule,
  GameModule,
];

// Adding SqlHelperModule module only if mode is dev
if (process.env.NODE_ENV === 'dev') defaultModules.push(SqlHelperModule);

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://root:example@mongo:27017/'),

    ConfigModule.forRoot({
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
    }),

    TypeOrmModule.forRoot(typeormConfig),
    // SentryModule.forRoot({
    //   dsn: 'http://00aa0a3b572f46878e7b9aa54f9932af@localhost:9001/3',
    //   debug: true,
    //   environment: process.env.NODE_ENV,
    //   release: 'some_release',
    //   logLevel: LogLevel.Debug,
    // }),
    ...defaultModules,
  ],
})
export class AppModule {}
