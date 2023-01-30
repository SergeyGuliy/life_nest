import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { LocalStrategy } from './strategies/local.strategy.js';
import { PasswordEncoderService } from './password-encoder.service.js';
import { EntityManagerModule } from '../../modules-helpers/entities-services/entitiy-manager.module.js';
import { GlobalServicesModule } from '../../modules-helpers/global-services/global-services.module.js';

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
