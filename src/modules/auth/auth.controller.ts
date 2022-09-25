import { Controller, Post, Body, UseGuards } from '@nestjs/common';

import { RegistrationDto } from '@assets/dto/registrationDto';
import { LoginDto } from '@assets/dto/loginDto';

import { LocalStrategy } from './strategies/local.strategy';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '@assets/guards/auth/auth.guard';
import { User } from '@assets/decorators/user.decorator';
import { UserCanBeCreatedGuard } from '@assets/guards/auth/user-can-be-created.guard';
import { ValidateLoginPasswordGuard } from '@assets/guards/auth/validate-login-password.guard';
import { ValidateChangePasswordGuard } from '@assets/guards/auth/validate-change-password.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly localStrategy: LocalStrategy,
    private readonly authService: AuthService,
  ) {}

  @Post('registration')
  @UseGuards(UserCanBeCreatedGuard)
  registration(@Body() userData: RegistrationDto) {
    return this.authService.register(userData);
  }

  @Post('login')
  @UseGuards(ValidateLoginPasswordGuard)
  logIn(@Body() userData: LoginDto) {
    return this.authService.login(userData);
  }

  @Post('refresh-token')
  refreshToken(@Body() { userId, refreshToken }) {
    return this.authService.refreshToken(userId, refreshToken);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard, ValidateChangePasswordGuard)
  changePassword(@Body() { newPassword }, @User() { userId }) {
    return this.authService.changePassword(userId, newPassword);
  }
}
