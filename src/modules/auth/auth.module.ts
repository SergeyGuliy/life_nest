import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { Users } from '../../plugins/database/entities/users.entity';
import { PasswordEncoderService } from './password-encoder.service';
import { UserSettings } from '../../plugins/database/entities/users-settings.entity';
import { EntityManagerModule } from '../../assets/entitiesManagers/entitiy-manager.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, UserSettings]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_AT },
    }),
    EntityManagerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, PasswordEncoderService],
})
export class AuthModule {}
