import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { PasswordEncoderService } from './password-encoder.service';
import { CreateUserDto } from '../../plugins/dto/createUser.dto';
import * as phone from 'phone';
import { UserManagerService } from '../../assets/entitiesManagers/users/user.service';
import { UserSettingsManagerService } from '../../assets/entitiesManagers/users/user-settings.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private passwordEncoderService: PasswordEncoderService,
    private readonly userManagerService: UserManagerService,
    private readonly userSettingsManagerService: UserSettingsManagerService,
  ) {}

  async register(body) {
    await this.registerMiddleware(body);
    body.refreshToken = uuidv4();
    const { userId } = await this.createUser(body);
    const userData = await this.userManagerService.getUserByIdWithToken(userId);
    return this.returnUserDataToClient(userData);
  }

  async login(body): Promise<any> {
    const user = await this.userManagerService.getUserByEmailOrPhoneOrId(body);
    if (!user) {
      throw new HttpException('User is not found', HttpStatus.NOT_FOUND);
    }
    await this.passwordEncoderService.validatePassword(
      body.password,
      user.password,
    );
    const userData = await this.userManagerService.getUserByIdWithToken(
      user.userId,
    );
    return this.returnUserDataToClient(userData);
  }

  async refreshToken(userId, oldRefreshToken) {
    const user = await this.userManagerService.getUserByIdWithToken(userId);
    if (user.refreshToken === oldRefreshToken) {
      const userData = await this.setNewRefreshTokenToUser(user.userId);
      return this.returnUserDataToClient(userData);
    } else {
      await this.setNewRefreshTokenToUser(user.userId);
      throw new HttpException('Invalid refreshToken', HttpStatus.BAD_REQUEST);
    }
  }

  async changePassword(userData, oldPassword, newPassword) {
    const securedUserData = await this.userManagerService.getUserByEmailOrPhoneOrId(
      userData,
    );
    await this.passwordEncoderService.validatePassword(
      oldPassword,
      securedUserData.password,
    );
    await this.userManagerService.update(userData.userId, {
      password: newPassword,
    });
    return 'Password successfully changed';
  }

  async setNewRefreshTokenToUser(userId: number) {
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

  async createUser(user: CreateUserDto) {
    const formattedUser = {
      phoneCountryCode: '',
      country: '',
      userSettings: undefined,
      ...user,
    };
    const formattedPhone = phone(user.phone);
    formattedUser.phoneCountryCode = formattedPhone[0];
    formattedUser.country = formattedPhone[1];
    formattedUser.password = await this.passwordEncoderService.generatePasswordHash(
      user.password,
    );
    formattedUser.userSettings = await this.userSettingsManagerService.saveUserSettings(
      {},
    );
    return await this.userManagerService.saveUser(formattedUser);
  }

  async registerMiddleware({ email, phone }) {
    const userSearchEmail = await this.userManagerService.findOne({
      where: [{ email }],
    });
    const userSearchPhone = await this.userManagerService.findOne({
      where: [{ phone }],
    });
    if (userSearchEmail && userSearchPhone) {
      throw new HttpException(
        'Email and phone already in use',
        HttpStatus.BAD_REQUEST,
      );
    } else if (userSearchEmail) {
      throw new HttpException('Email already in use', HttpStatus.BAD_REQUEST);
    } else if (userSearchPhone) {
      throw new HttpException('Phone already in use', HttpStatus.BAD_REQUEST);
    }
  }
}
