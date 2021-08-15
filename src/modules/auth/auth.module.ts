import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { PasswordEncoderService } from './password-encoder.service';
import { EntityManagerModule } from '../../sub_modules/entitiesManagers/entitiy-manager.module';
import { MyLogger } from '../../assets/globalServices/my-logger.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_AT },
    }),
    EntityManagerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, PasswordEncoderService, MyLogger],
})
export class AuthModule {}
