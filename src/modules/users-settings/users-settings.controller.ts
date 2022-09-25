import { Controller, Post, Body, UseGuards } from '@nestjs/common';

import { UsersSettingsService } from './users-settings.service';
import { JwtAuthGuard } from '../../assets/guards/auth.guard';
import { User } from '../../assets/decorators/user.decorator';

@Controller('auth')
export class UsersSettingsController {
  constructor(private readonly authService: UsersSettingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('change-locale')
  changeLocale(@Body() { locale }, @User() userData) {
    return this.authService.changeLanguage(userData, locale);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-theme')
  changeTheme(@Body() { isDarkTheme }, @User() userData) {
    return this.authService.changeTheme(userData, isDarkTheme);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update-settings')
  updateUserSettings(@Body() userSettings, @User() userData) {
    return this.authService.updateUserSettings(userData, userSettings);
  }
}
