import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import * as phone from 'phone';

import { PasswordEncoderService } from './password-encoder.service';
import { CreateUserDto } from '@assets/dto/createUser.dto';
import { UsersManagerService } from '@modules-helpers/entities-services/users/users.service';
import { UsersSettingsManagerService } from '@modules-helpers/entities-services/users-settings/users-settings.service';
import { MyLogger } from '@modules-helpers/global-services/my-logger.service';
import { ErrorHandlerService } from '@modules-helpers/global-services/error-handler.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly passwordEncoderService: PasswordEncoderService,
    private readonly userManagerService: UsersManagerService,
    private readonly userSettingsManagerService: UsersSettingsManagerService,
    private readonly myLogger: MyLogger,
  ) {}

  async register(newUserData): Promise<any> {
    await this.registerMiddleware(newUserData);
    const { userId } = await this.createUser({
      ...newUserData,
      refreshToken: uuidv4(),
    });
    const userData = await this.userManagerService.getUserByIdWithToken(userId);
    return this.returnUserDataToClient(userData);
  }

  async login(authData): Promise<any> {
    const user = await this.userManagerService.getUserByEmailOrPhoneOrId(
      authData,
    );
    await this.passwordEncoderService.validatePassword(
      authData.password,
      user.password,
    );
    const userData = await this.userManagerService.getUserByIdWithToken(
      user.userId,
    );
    return this.returnUserDataToClient(userData);
  }

  async refreshToken(userId, oldRefreshToken): Promise<any> {
    const user = await this.userManagerService.getUserByIdWithToken(userId);
    if (user.refreshToken === oldRefreshToken) {
      const userData = await this.setNewRefreshTokenToUser(user.userId);
      return this.returnUserDataToClient(userData);
    } else {
      await this.setNewRefreshTokenToUser(user.userId);
      this.errorHandlerService.error('invalidRefreshToken', 'en');
    }
  }

  async changePassword(authData, oldPassword, newPassword): Promise<any> {
    const securedUserData = await this.userManagerService.getUserByEmailOrPhoneOrId(
      authData,
    );
    await this.passwordEncoderService.validatePassword(
      oldPassword,
      securedUserData.password,
    );
    await this.userManagerService.update(authData.userId, {
      password: newPassword,
    });
    return 'Password successfully changed';
  }

  async setNewRefreshTokenToUser(userId: number): Promise<any> {
    await this.userManagerService.update(userId, {
      refreshToken: uuidv4(),
    });
    return this.userManagerService.getUserByIdWithToken(userId);
  }

  returnUserDataToClient(userData) {
    return {
      userData,
      refreshToken: userData.refreshToken,
      accessToken: this.jwtService.sign({
        userId: userData.userId,
        userSettingsId: userData.userSettings.userSettingsId,
      }),
    };
  }

  async createUser(user: CreateUserDto): Promise<any> {
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

  async registerMiddleware({ email, phone }): Promise<any> {
    const userSearchEmail = await this.userManagerService.findOne({
      where: [{ email }],
    });
    const userSearchPhone = await this.userManagerService.findOne({
      where: [{ phone }],
    });
    if (userSearchEmail && userSearchPhone) {
      this.errorHandlerService.error('phoneAndEmailAlreadyInUse', 'en');
    } else if (userSearchEmail) {
      this.errorHandlerService.error('emailAlreadyInUse', 'en');
    } else if (userSearchPhone) {
      this.errorHandlerService.error('phoneAlreadyInUse', 'en');
    }
  }
}
