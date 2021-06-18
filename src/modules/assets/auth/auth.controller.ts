import { Controller, Post, Body, UseGuards } from '@nestjs/common';

import { RegistrationDto } from './dto/registrationDto';
import { LoginDto } from './dto/loginDto';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt/auth.guard';
import { User } from '../../../plugins/decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly localStrategy: LocalStrategy,
    private readonly authService: AuthService,
  ) {}

  @Post('registration')
  registration(@Body() userData: RegistrationDto) {
    return this.authService.register(userData);
  }

  @Post('login')
  logIn(@Body() userData: LoginDto) {
    return this.authService.login(userData);
  }

  @Post('refresh-token')
  refreshToken(@Body() { userId, refreshToken }) {
    return this.authService.refreshToken(userId, refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  changePassword(@Body() { oldPassword, newPassword }, @User() userData) {
    return this.authService.changePassword(userData, oldPassword, newPassword);
  }
}
