import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { PasswordEncoderService } from './password-encoder.service';
import { EntityManagerModule } from '../../modules-helpers/entities-services/entitiy-manager.module';
import { GlobalServicesModule } from '../../modules-helpers/global-services/global-services.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_AT },
    }),
    EntityManagerModule,
    GlobalServicesModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, PasswordEncoderService],
})
export class AuthModule {}
