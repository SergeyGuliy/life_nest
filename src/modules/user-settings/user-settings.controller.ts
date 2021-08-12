import { Controller, Post, Body, UseGuards } from '@nestjs/common';

import { UserSettingsService } from './user-settings.service';
import { JwtAuthGuard } from '../../plugins/guards/auth.guard';
import { User } from '../../plugins/decorators/user.decorator';

@Controller('auth')
export class UserSettingsController {
  constructor(private readonly authService: UserSettingsService) {}

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
