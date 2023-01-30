import { Controller, Post, Body, UseGuards, Inject } from '@nestjs/common';

import { UsersSettingsService } from './users-settings.service.js';
import { JwtAuthGuard } from '../../assets/guards/auth/auth.guard.js';
import { User } from '../../assets/decorators/user.decorator.js';

@Controller('users-settings')
export class UsersSettingsController {
  @Inject(UsersSettingsService)
  private readonly usersSettingsService: UsersSettingsService;

  @Post('change-locale')
  @UseGuards(JwtAuthGuard)
  changeLocale(@Body() { locale }, @User() userData) {
    return this.usersSettingsService.changeLanguage(userData, locale);
  }

  @Post('change-theme')
  @UseGuards(JwtAuthGuard)
  changeTheme(@Body() { isDarkTheme }, @User() userData) {
    return this.usersSettingsService.changeTheme(userData, isDarkTheme);
  }

  @Post('update-settings')
  @UseGuards(JwtAuthGuard)
  updateUserSettings(@Body() userSettings, @User() userData) {
    return this.usersSettingsService.updateUserSettings(userData, userSettings);
  }
}
