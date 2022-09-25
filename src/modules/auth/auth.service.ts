import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import * as phone from 'phone';

import { PasswordEncoderService } from './password-encoder.service';
import { CreateUserDto } from '@assets/dto/createUser.dto';
import { UsersManagerService } from '@modules-helpers/entities-services/users/users.service';
import { UsersSettingsManagerService } from '@modules-helpers/entities-services/users-settings/users-settings.service';
import { ErrorHandlerService } from '@modules-helpers/global-services/error-handler.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly passwordEncoderService: PasswordEncoderService,
    private readonly userManagerService: UsersManagerService,
    private readonly userSettingsManagerService: UsersSettingsManagerService,
  ) {}

  private async setNewRefreshTokenToUser(userId: number): Promise<any> {
    await this.userManagerService.update(userId, {
      refreshToken: uuidv4(),
    });
    return this.userManagerService.getUserByIdWithToken(userId);
  }

  private returnUserDataToClient(userData) {
    return {
      userData,
      refreshToken: userData.refreshToken,
      accessToken: this.jwtService.sign({
        userId: userData.userId,
        userSettingsId: userData.userSettings.userSettingsId,
      }),
    };
  }

  public async register(newUserData): Promise<any> {
    const { userId } = await this.createUser({
      ...newUserData,
      refreshToken: uuidv4(),
    });
    const userData = await this.userManagerService.getUserByIdWithToken(userId);
    return this.returnUserDataToClient(userData);
  }

  public async login({ email }): Promise<any> {
    const { userId } = await this.userManagerService.getUserByEmailOrPhoneOrId({
      email,
    });
    const userData = await this.userManagerService.getUserByIdWithToken(userId);
    return this.returnUserDataToClient(userData);
  }

  public async refreshToken(userId, oldRefreshToken): Promise<any> {
    const { refreshToken } = await this.userManagerService.getUserByIdWithToken(
      userId,
    );

    const userData = await this.setNewRefreshTokenToUser(userId);

    if (refreshToken === oldRefreshToken) {
      return this.returnUserDataToClient(userData);
    } else {
      await this.setNewRefreshTokenToUser(userId);
      this.errorHandlerService.error('invalidRefreshToken', 'en');
    }
  }

  public async changePassword(userId, newPassword): Promise<any> {
    await this.userManagerService.update(userId, {
      password: newPassword,
    });
    return 'Password successfully changed';
  }

  public async createUser(user: CreateUserDto): Promise<any> {
    const formattedPhone = phone(user.phone);

    const formattedUser = {
      ...user,
      phoneCountryCode: formattedPhone[0],
      country: formattedPhone[1],
      password: await this.passwordEncoderService.generatePasswordHash(
        user.password,
      ),
      userSettings: await this.userSettingsManagerService.saveUserSettings({}),
    };
    return await this.userManagerService.save(formattedUser);
  }
}
