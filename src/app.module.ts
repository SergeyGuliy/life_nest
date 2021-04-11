import { Module } from '@nestjs/common';
import { UserModule } from './modules/users/user.module';
import { SqlHelperModule } from './modules/sql-helper/sql-helper.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './plugins/database/typeorm-config';
import { RoomsModule } from './modules/rooms/rooms.module';
import { WebSocketModule } from './modules/web-socket/web-socket.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';

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
    WebSocketModule,
    AuthModule,
    UserModule,
    SqlHelperModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
