import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { PasswordEncoderService } from './password-encoder.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../database/entities/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../../users/dto/createUser.dto';
import * as phone from 'phone';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
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
    const user = await this.getUserByEmailOrPhone(body);
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

  async setNewRefreshTokenToUser(userId: number) {
    await this.usersRepository.update(userId, {
      refreshToken: uuidv4(),
    });
    return this.getUserByIdWithToken(userId);
  }

  async getUserByEmailOrPhone({ phone, email }) {
    return await this.usersRepository
      .createQueryBuilder('user')
      .select(['user.phone', 'user.email', 'user.password', 'user.userId'])
      .where('user.email = :email', { email })
      .orWhere('user.phone = :phone', { phone })
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
        'country',
        'refreshToken',
        'isDarkTheme',
        'createdRoomId',
        'roomJoinedId',
        'avatarSmall',
        'avatarBig',
      ],
    });
  }

  returnUserDataToClient(userData) {
    return {
      userData,
      refreshToken: userData.refreshToken,
      accessToken: this.jwtService.sign({
        userId: userData.userId,
      }),
    };
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
    formattedUser.password = await this.passwordEncoderService.generatePasswordHash(
      user.password,
    );
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
