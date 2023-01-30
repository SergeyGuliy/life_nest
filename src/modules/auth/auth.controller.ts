import { Controller, Post, Body, UseGuards, Inject } from '@nestjs/common';

import { RegistrationDto } from '../../assets/dto/registrationDto.js';
import { LoginDto } from '../../assets/dto/loginDto.js';
import { AuthService } from './auth.service.js';

import { JwtAuthGuard } from '../../assets/guards/auth/auth.guard.js';
import { User } from '../../assets/decorators/user.decorator.js';
import { UserCanBeCreatedGuard } from '../../assets/guards/auth/user-can-be-created.guard.js';
import { ValidateLoginPasswordGuard } from '../../assets/guards/auth/validate-login-password.guard.js';
import { ValidateChangePasswordGuard } from '../../assets/guards/auth/validate-change-password.guard.js';
import { ValidateRevalidationTokenGuard } from '../../assets/guards/auth/validate-revalidation-token.guard.js';

@Controller('auth')
export class AuthController {
  @Inject(AuthService)
  private readonly authService: AuthService;

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
  @UseGuards(ValidateRevalidationTokenGuard)
  refreshToken(@Body() { userId }) {
    return this.authService.refreshToken(userId);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard, ValidateChangePasswordGuard)
  changePassword(@Body() { newPassword }, @User() { userId }) {
    return this.authService.changePassword(userId, newPassword);
  }
}
