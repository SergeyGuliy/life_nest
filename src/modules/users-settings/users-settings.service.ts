import { Inject, Injectable } from '@nestjs/common';

import { UsersManager } from '@modules-helpers/entities-services/users/users.service';
import { UsersSettingsManager } from '@modules-helpers/entities-services/users-settings/users-settings.service';

@Injectable()
export class UsersSettingsService {
  @Inject(UsersManager)
  private readonly usersManager: UsersManager;
  @Inject(UsersSettingsManager)
  private readonly userSettingsManager: UsersSettingsManager;

  public async changeLanguage({ userSettingsId }, locale) {
    return await this.userSettingsManager.db.save({
      userSettingsId,
      locale: locale,
    });
  }

  public async changeTheme({ userSettingsId }, isDarkTheme) {
    return await this.userSettingsManager.db.save({
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
      newUserSettings = await this.userSettingsManager.db.save({
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
