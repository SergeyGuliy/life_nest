import { Controller, Post, Body, UseGuards, Inject } from '@nestjs/common';

import { UsersSettingsService } from './users-settings.service';
import { JwtAuthGuard } from '@assets/guards/auth/auth.guard';
import { User } from '@assets/decorators/user.decorator';

@Controller('users-settings')
export class UsersSettingsController {
  @Inject(UsersSettingsService)
  private readonly authService: UsersSettingsService;

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
