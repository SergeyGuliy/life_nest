import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import * as phone from 'phone';

import { PasswordEncoderService } from './password-encoder.service';
import { UsersManager } from '@modules-helpers/entities-services/users/users.service';
import { UsersSettingsManagerService } from '@modules-helpers/entities-services/users-settings/users-settings.service';

@Injectable()
export class AuthService {
  @Inject(JwtService)
  private readonly jwtService: JwtService;
  @Inject(UsersManager)
  private readonly usersManager: UsersManager;
  @Inject(PasswordEncoderService)
  private readonly passwordEncoderService: PasswordEncoderService;
  @Inject(UsersSettingsManagerService)
  private readonly userSettingsManagerService: UsersSettingsManagerService;

  private async returnUserDataToClient(userId) {
    const userData = await this.setNewRefreshTokenToUser(userId);

    return {
      userData,
      refreshToken: userData.refreshToken,
      accessToken: this.jwtService.sign({
        userId: userData.userId,
        userSettingsId: userData.userSettings.userSettingsId,
      }),
    };
  }

  public async setNewRefreshTokenToUser(userId: number): Promise<any> {
    await this.usersManager.db.update(userId, {
      refreshToken: uuidv4(),
    });
    return this.usersManager.fetchSecuredUserData(userId);
  }

  public async register(newUserData): Promise<any> {
    const [phoneCountryCode, country] = phone(newUserData.phone);

    const formattedUser = {
      ...newUserData,
      phoneCountryCode,
      country,
      password: await this.passwordEncoderService.generatePasswordHash(
        newUserData.password,
      ),
      refreshToken: uuidv4(),
      userSettings: await this.userSettingsManagerService.saveUserSettings({}),
    };
    const { userId } = await this.usersManager.db.save(formattedUser);
    return this.returnUserDataToClient(userId);
  }

  public async login({ email }): Promise<any> {
    const { userId } = await this.usersManager.getUserByEmailOrPhoneOrId({
      email,
    });
    return this.returnUserDataToClient(userId);
  }

  public async refreshToken(userId): Promise<any> {
    return this.returnUserDataToClient(userId);
  }

  public async changePassword(userId, newPassword): Promise<any> {
    await this.usersManager.db.update(userId, {
      password: newPassword,
    });
    return 'Password successfully changed';
  }
}
