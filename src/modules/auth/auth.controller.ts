import { Controller, Post, Body } from '@nestjs/common';

import { RegistrationDto } from './dto/registrationDto';
import { LoginDto } from './dto/loginDto';
import { LocalStrategy } from './strategies/local.strategy';

@Controller('auth')
export class AuthController {
  constructor(private readonly localStrategy: LocalStrategy) {}

  @Post('registration')
  registration(@Body() userData: RegistrationDto) {
    return this.localStrategy.register(userData);
  }

  @Post('login')
  logIn(@Body() userData: LoginDto) {
    return this.localStrategy.login(userData);
  }
}
