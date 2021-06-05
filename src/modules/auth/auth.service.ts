import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

import {
  checkPassword,
  generatePasswordHash,
} from '../../plugins/helpers/password-encoder';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../../plugins/database/entities/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../users/dto/createUser.dto';
import * as phone from 'phone';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async register(body) {
    const userSearchEmail = await this.checkIsEmailAvailable(body.email);
    const userSearchPhone = await this.checkIsPhoneAvailable(body.phone);
    if (userSearchEmail && userSearchPhone) {
      throw new HttpException(
        'Email and phone already in use',
        HttpStatus.BAD_REQUEST,
      );
    } else if (userSearchEmail) {
      throw new HttpException('Email already in use', HttpStatus.BAD_REQUEST);
    } else if (userSearchPhone) {
      throw new HttpException('Phone already in use', HttpStatus.BAD_REQUEST);
    } else {
      body.refreshToken = uuidv4();
      const user = await this.createUser(body);
      const { password, refreshToken, ...userData } = user;
      return {
        userData,
        refreshToken,
        accessToken: this.jwtService.sign({
          userId: userData.userId,
        }),
      };
    }
  }

  async validateUser(userId): Promise<any> {
    const user = await this.getUserByIdWithToken(userId);
    if (user) {
      const { password, refreshToken, ...result } = user;
      return result;
    }
    return null;
  }

  async login(body): Promise<any> {
    const user = await this.getUserSecured(body);
    if (!user || !(await this.validatePassword(body.password, user.password))) {
      throw new HttpException('Wrong password or login', HttpStatus.NOT_FOUND);
    } else {
      const userData = await this.setNewRefreshTokenToUser(user.userId);
      return {
        userData,
        refreshToken: userData.refreshToken,
        accessToken: this.jwtService.sign({
          userId: userData.userId,
        }),
      };
    }
  }

  async refreshToken(userId, oldRefreshToken) {
    const user = await this.getUserByIdWithToken(userId);
    if (user.refreshToken === oldRefreshToken) {
      const newUser = await this.setNewRefreshTokenToUser(user.userId);
      const { password, refreshToken, ...userData } = newUser;
      return {
        userData,
        refreshToken,
        accessToken: this.jwtService.sign({
          userId: userData.userId,
        }),
      };
    } else {
      await this.setNewRefreshTokenToUser(user.userId);
      throw new HttpException('Invalid refreshToken', HttpStatus.BAD_REQUEST);
    }
  }

  async validatePassword(bodyPassword, userPassword) {
    const isPasswordSame = bodyPassword === userPassword;
    const isPasswordHashedSame = await checkPassword(
      bodyPassword,
      userPassword,
    );
    return isPasswordSame || isPasswordHashedSame;
  }

  async setNewRefreshTokenToUser(userId: number) {
    await this.usersRepository.update(userId, {
      refreshToken: uuidv4(),
    });
    return this.getUserByIdWithToken(userId);
  }

  async getUserSecured({ phone, email }) {
    return await this.usersRepository
      .createQueryBuilder('user')
      .select(['user.phone', 'user.email', 'user.password', 'user.userId'])
      .where('user.email = :email', { email })
      .orWhere('user.phone = :phone', { phone })
      .getOne();
  }

  async getUserByIdWithToken(userId: number) {
    const user = await this.usersRepository.findOne(userId, {
      select: [
        'userId',
        'email',
        'phone',
        'role',
        'userOnlineStatus',
        'userGameStatus',
        'firstName',
        'country',
        'refreshToken',
        'isDarkTheme',
        'createdRoomId',
        'roomJoinedId',
      ],
    });
    if (user) {
      return user;
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  async checkIsEmailAvailable(email: string) {
    return await this.usersRepository.findOne({
      where: [{ email }],
    });
  }

  async checkIsPhoneAvailable(phone: string) {
    return await this.usersRepository.findOne({
      where: [{ phone }],
    });
  }

  async createUser(user: CreateUserDto) {
    const formattedUser = {
      phoneCountryCode: '',
      country: '',
      ...user,
    };
    const formattedPhone = phone(user.phone);
    formattedUser.phoneCountryCode = formattedPhone[0];
    formattedUser.country = formattedPhone[1];
    formattedUser.password = await generatePasswordHash(user.password);
    return await this.usersRepository.save(formattedUser);
  }
}
