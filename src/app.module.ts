import { Module } from '@nestjs/common';
import { UserModule } from './modules/users/user.module';
import { SqlHelperModule } from './plugins/sql-helper/sql-helper.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './plugins/database/typeorm-config';
import { RoomsModule } from './modules/rooms/rooms.module';
import { ChatsModule } from './modules/chats/chats.module';
import { AppController } from './app.controller';
import { SocketModule } from './assets/socket/socket.module';
import { UploaderModule } from './assets/uploader/uploader.module';
import { FriendshipModule } from './modules/friendship/friendship.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
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
    // RoomsModule,
    // ChatsModule,
    AuthModule,
    UserModule,
    // SocketModule,
    // SqlHelperModule,
    // UploaderModule,
    // FriendshipModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
