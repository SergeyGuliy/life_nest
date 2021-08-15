import { Injectable } from '@nestjs/common';

import { UserManagerService } from '../../sub_modules/entitiesManagers/users/user.service';
import { UserSettingsManagerService } from '../../sub_modules/entitiesManagers/users/user-settings.service';

@Injectable()
export class UserSettingsService {
  constructor(
    private readonly userManagerService: UserManagerService,
    private readonly userSettingsManagerService: UserSettingsManagerService,
  ) {}

  async changeLanguage({ userSettingsId }, locale) {
    return await this.userSettingsManagerService.saveUserSettings({
      userSettingsId,
      locale: locale,
    });
  }

  async changeTheme({ userSettingsId }, isDarkTheme) {
    return await this.userSettingsManagerService.saveUserSettings({
      userSettingsId,
      isDarkTheme: isDarkTheme,
    });
  }

  async updateUserSettings(
    { userId, userSettingsId },
    { profileSettings, userSettings },
  ) {
    let newProfileSettings, newUserSettings;
    if (profileSettings) {
      newProfileSettings = await this.userManagerService.save({
        userId,
        ...profileSettings,
      });
    }
    if (userSettings) {
      newUserSettings = await this.userSettingsManagerService.saveUserSettings({
        userSettingsId,
        ...userSettings,
      });
    }
    return {
      profileSettings: newProfileSettings,
      userSettings: newUserSettings,
    };
  }
}
