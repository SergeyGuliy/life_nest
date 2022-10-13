import { Inject, Injectable } from '@nestjs/common';

import { UsersManager } from '@modules-helpers/entities-services/users/users.service';
import { UsersSettingsManagerService } from '@modules-helpers/entities-services/users-settings/users-settings.service';

@Injectable()
export class UsersSettingsService {
  @Inject(UsersManager)
  private readonly usersManager: UsersManager;
  @Inject(UsersSettingsManagerService)
  private readonly userSettingsManagerService: UsersSettingsManagerService;

  public async changeLanguage({ userSettingsId }, locale) {
    return await this.userSettingsManagerService.saveUserSettings({
      userSettingsId,
      locale: locale,
    });
  }

  public async changeTheme({ userSettingsId }, isDarkTheme) {
    return await this.userSettingsManagerService.saveUserSettings({
      userSettingsId,
      isDarkTheme: isDarkTheme,
    });
  }

  public async updateUserSettings(
    { userId, userSettingsId },
    { profileSettings, userSettings },
  ) {
    let newProfileSettings, newUserSettings;
    if (profileSettings) {
      newProfileSettings = await this.usersManager.db.save({
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
