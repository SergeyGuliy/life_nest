import { Module } from '@nestjs/common';
import { UserModule } from './modules/users/user.module';
import { SqlHelperModule } from './modules/assets/sql-helper/sql-helper.module';
import { AuthModule } from './modules/assets/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './modules/assets/database/typeorm-config';
import { RoomsModule } from './modules/rooms/rooms.module';
import { ChatsModule } from './modules/chats/chats.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { WebSocketModule } from './modules/assets/web-socket/web-socket.module';
import { UploaderModule } from './modules/assets/uploader/uploader.module';

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
    RoomsModule,
    ChatsModule,
    AuthModule,
    UserModule,
    WebSocketModule,
    SqlHelperModule,
    UploaderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
