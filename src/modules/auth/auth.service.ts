import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { checkPassword } from '../../plugins/helpers/password-encoder';
import { JwtService } from '@nestjs/jwt';
import UserService from '../users/user.service';

@Injectable()
export default class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async createUser(body) {
    const userSearchEmail = await this.usersService.getUserByEmail(body.email);
    const userSearchPhone = await this.usersService.getUserByPhone(body.phone);
    if (userSearchEmail || userSearchPhone) {
      if (userSearchEmail) {
        throw new HttpException('Email already in use', HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException('Phone already in use', HttpStatus.BAD_REQUEST);
      }
    } else {
      const user = await this.usersService.createUser(body);
      const { password, ...userData } = user;
      return {
        userData,
        access_token: this.jwtService.sign(userData),
      };
    }
  }

  async validateUser(body): Promise<any> {
    const user = await this.usersService.getUserByPhoneOrEmail(
      body.phone,
      body.email,
    );
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const isPasswordSame = body.password === user.password;
    const isPasswordHashedSame = await checkPassword(
      body.password,
      user.password,
    );
    if (user && (isPasswordSame || isPasswordHashedSame)) {
      const { password, ...userData } = user;
      return {
        userData,
        access_token: this.jwtService.sign(userData),
      };
    }
    return null;
  }
}
