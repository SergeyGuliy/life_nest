import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

import { UserService } from '../users/user.service';
import { checkPassword } from '../../plugins/helpers/password-encoder';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(body) {
    const userSearchEmail = await this.usersService.getUserByEmail(body.email);
    const userSearchPhone = await this.usersService.getUserByPhone(body.phone);
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
      const user = await this.usersService.createUser(body);
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
    const user = await this.usersService.getUserById(userId);
    if (user) {
      const { password, refreshToken, ...result } = user;
      return result;
    }
    return null;
  }

  async login(body): Promise<any> {
    const user = await this.usersService.getUserByPhoneOrEmail(
      body.phone,
      body.email,
    );
    if (!user || !(await this.validatePassword(body.password, user.password))) {
      throw new HttpException('Wrong password or login', HttpStatus.NOT_FOUND);
    } else {
      const newUser = await this.usersService.setNewRefreshTokenToUser(
        user.userId,
      );
      const { password, refreshToken, ...userData } = newUser;
      return {
        userData,
        refreshToken,
        accessToken: this.jwtService.sign({
          userId: userData.userId,
        }),
      };
    }
  }

  async refreshToken(userId, oldRefreshToken) {
    const user = await this.usersService.getUserById(userId);
    if (user.refreshToken === oldRefreshToken) {
      const newUser = await this.usersService.setNewRefreshTokenToUser(
        user.userId,
      );
      const { password, refreshToken, ...userData } = newUser;
      return {
        userData,
        refreshToken,
        accessToken: this.jwtService.sign({
          userId: userData.userId,
        }),
      };
    } else {
      await this.usersService.setNewRefreshTokenToUser(user.userId);
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
}
