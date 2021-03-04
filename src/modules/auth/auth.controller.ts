import { Controller, Post, Body } from '@nestjs/common';
import { RegistrationDto } from './dto/registrationDto';
import AuthService from './auth.service';

console.log(RegistrationDto);
@Controller('auth')
export default class AuthController {
  constructor(private readonly userService: AuthService) {}

  @Post('registration')
  registration(@Body() userData: RegistrationDto) {
    return this.userService.registration(userData);
  }

  @Post('login')
  logIn(@Body() userData: RegistrationDto) {
    return this.userService.login(userData);
  }
}
