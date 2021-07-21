import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { PasswordEncoderService } from './password-encoder.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../database/entities/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../../users/dto/createUser.dto';
import * as phone from 'phone';
import { UserSettings } from '../database/entities/users-settings.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(UserSettings)
    private userSettingsRepository: Repository<UserSettings>,
    private passwordEncoderService: PasswordEncoderService,
  ) {}

  async register(body) {
    await this.registerMiddleware(body);
    body.refreshToken = uuidv4();
    const { userId } = await this.createUser(body);
    const userData = await this.getUserByIdWithToken(userId);
    return this.returnUserDataToClient(userData);
  }

  async login(body): Promise<any> {
    const user = await this.getUserByEmailOrPhoneOrId(body);
    if (!user) {
      throw new HttpException('User is not found', HttpStatus.NOT_FOUND);
    }
    await this.passwordEncoderService.validatePassword(
      body.password,
      user.password,
    );
    const userData = await this.getUserByIdWithToken(user.userId);
    return this.returnUserDataToClient(userData);
  }

  async refreshToken(userId, oldRefreshToken) {
    const user = await this.getUserByIdWithToken(userId);
    if (user.refreshToken === oldRefreshToken) {
      const userData = await this.setNewRefreshTokenToUser(user.userId);
      return this.returnUserDataToClient(userData);
    } else {
      await this.setNewRefreshTokenToUser(user.userId);
      throw new HttpException('Invalid refreshToken', HttpStatus.BAD_REQUEST);
    }
  }

  async changePassword(userData, oldPassword, newPassword) {
    const securedUserData = await this.getUserByEmailOrPhoneOrId(userData);
    await this.passwordEncoderService.validatePassword(
      oldPassword,
      securedUserData.password,
    );
    await this.usersRepository.update(userData.userId, {
      password: newPassword,
    });
    return 'Password successfully changed';
  }

  async changeLanguage({ userSettingsId }, locale) {
    return await this.userSettingsRepository.save({
      userSettingsId,
      locale: locale,
    });
  }

  async changeTheme({ userSettingsId }, isDarkTheme) {
    return await this.userSettingsRepository.save({
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
      newProfileSettings = await this.usersRepository.save({
        userId,
        ...profileSettings,
      });
    }
    if (userSettings) {
      newUserSettings = await this.userSettingsRepository.save({
        userSettingsId,
        ...userSettings,
      });
    }
    return {
      profileSettings: newProfileSettings,
      userSettings: newUserSettings,
    };
  }

  async setNewRefreshTokenToUser(userId: number) {
    await this.usersRepository.update(userId, {
      refreshToken: uuidv4(),
    });
    return this.getUserByIdWithToken(userId);
  }

  async getUserByEmailOrPhoneOrId({ userId, phone, email }) {
    return await this.usersRepository
      .createQueryBuilder('user')
      .select(['user.phone', 'user.email', 'user.password', 'user.userId'])
      .where('user.email = :email', { email })
      .orWhere('user.phone = :phone', { phone })
      .orWhere('user.userId = :userId', { userId })
      .getOne();
  }

  async getUserByIdWithToken(userId: number) {
    const user = await this.fetchSecuredUserData(userId);
    if (user) {
      return user;
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  async fetchSecuredUserData(userId) {
    return await this.usersRepository.findOne(userId, {
      select: [
        'userId',
        'email',
        'phone',
        'role',
        'userOnlineStatus',
        'userGameStatus',
        'firstName',
        'lastName',
        'country',
        'refreshToken',
        'createdRoomId',
        'roomJoinedId',
        'avatarSmall',
        'avatarBig',
      ],
      relations: ['userSettings'],
    });
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
    formattedUser.userSettings = await this.userSettingsRepository.save({});
    return await this.usersRepository.save(formattedUser);
  }

  async registerMiddleware({ email, phone }) {
    const userSearchEmail = await this.usersRepository.findOne({
      where: [{ email }],
    });
    const userSearchPhone = await this.usersRepository.findOne({
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
