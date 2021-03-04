import { Module } from '@nestjs/common';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
// import { DatabaseModule } from './common/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './common/database/typeorm-config';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TypeOrmModule.forRoot(typeormConfig),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
