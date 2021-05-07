import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as phone from 'phone';

import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { Users } from '../../plugins/database/entities/users.entity';
import { generatePasswordHash } from '../../plugins/helpers/password-encoder';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async getAllUsers() {
    const users = await this.usersRepository.find();
    users.forEach((user) => {
      delete user.password;
      delete user.refreshToken;
    });
    return users;
  }

  async getUserById(userId: number) {
    const user = await this.usersRepository.findOne(userId);
    if (user) {
      return user;
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  async getUserByEmail(email: string) {
    return await this.usersRepository.findOne({
      where: [{ email }],
    });
  }

  async getUserByPhone(phone: string) {
    return await this.usersRepository.findOne({
      where: [{ phone }],
    });
  }

  async getUserByPhoneOrEmail(phone: string, email: string) {
    return await this.usersRepository.findOne({
      where: [{ phone }, { email }],
    });
  }

  async getUserByQuery(query) {
    const userData = await this.usersRepository.findOne(query);
    if (userData) {
      const {
        password,
        refreshToken,
        createdAt,
        updatedAt,
        ...userDataCropped
      } = userData;
      return userDataCropped;
    }
    return userData;
  }

  async getUsersByQuery(query) {
    const users = await this.usersRepository.find(query);
    return users.map((user) => {
      const {
        password,
        refreshToken,
        createdAt,
        updatedAt,
        ...userData
      } = user;
      return userData;
    });
  }

  async editUser(userId: number, user: UpdateUserDto) {
    await this.usersRepository.update(userId, user);
    const updatedUser = await this.usersRepository.findOne(userId);
    if (updatedUser) {
      return updatedUser;
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  async updateUser(userId: number, newUserData: UpdateUserDto) {
    await this.usersRepository.update(userId, newUserData);
  }

  async changeUserTheme(userId: number, { isDarkTheme }) {
    await this.usersRepository.update(userId, isDarkTheme);
    const updatedUser = await this.usersRepository.findOne(userId);
    if (updatedUser) {
      return updatedUser;
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
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
    const newUser = await this.usersRepository.save(formattedUser);
    // await this.usersRepository.save(newUser);
    return newUser;
  }

  async deleteUser(userId: number) {
    const deleteResponse = await this.usersRepository.delete(userId);
    if (!deleteResponse.affected) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  async setNewRefreshTokenToUser(userId: number) {
    await this.usersRepository.update(userId, {
      refreshToken: uuidv4(),
    });
    return this.getUserById(userId);
  }
}
