import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import * as phone from 'phone';

import { PasswordEncoderService } from './password-encoder.service';
import { UsersManagerService } from '@modules-helpers/entities-services/users/users.service';
import { UsersSettingsManagerService } from '@modules-helpers/entities-services/users-settings/users-settings.service';

@Injectable()
export class AuthService {
  @Inject(JwtService)
  private readonly jwtService: JwtService;
  @Inject(UsersManagerService)
  private readonly userManagerService: UsersManagerService;
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
    await this.userManagerService.update(userId, {
      refreshToken: uuidv4(),
    });
    return this.userManagerService.getUserByIdWithToken(userId);
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
    const { userId } = await this.userManagerService.save(formattedUser);
    return this.returnUserDataToClient(userId);
  }

  public async login({ email }): Promise<any> {
    const { userId } = await this.userManagerService.getUserByEmailOrPhoneOrId({
      email,
    });
    return this.returnUserDataToClient(userId);
  }

  public async refreshToken(userId): Promise<any> {
    return this.returnUserDataToClient(userId);
  }

  public async changePassword(userId, newPassword): Promise<any> {
    await this.userManagerService.update(userId, {
      password: newPassword,
    });
    return 'Password successfully changed';
  }
}
