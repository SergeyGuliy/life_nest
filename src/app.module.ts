import { Module } from '@nestjs/common';
import { UserModule } from './modules/users/user.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { DatabaseModule } from './common/database/database.module';

@Module({
  imports: [
    UserModule,
    DatabaseModule,
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
