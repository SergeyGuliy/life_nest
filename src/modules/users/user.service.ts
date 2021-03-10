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

  async getUserById(id: number) {
    const user = await this.usersRepository.findOne(id);
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

  async editUser(id: number, user: UpdateUserDto) {
    await this.usersRepository.update(id, user);
    const updatedUser = await this.usersRepository.findOne(id);
    if (updatedUser) {
      return updatedUser;
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  async changeUserTheme(id: number, { isDarkTheme }) {
    await this.usersRepository.update(id, isDarkTheme);
    const updatedUser = await this.usersRepository.findOne(id);
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
    const newUser = await this.usersRepository.create(formattedUser);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async deleteUser(id: number) {
    const deleteResponse = await this.usersRepository.delete(id);
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
