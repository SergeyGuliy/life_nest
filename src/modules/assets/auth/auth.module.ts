import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { Users } from '../database/entities/users.entity';
import { PasswordEncoderService } from './password-encoder.service';
import { UserSettings } from '../database/entities/users-settings.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, UserSettings]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_AT },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, PasswordEncoderService],
  exports: [AuthService, LocalStrategy],
})
export class AuthModule {}
