import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UpdateUserDto } from './dto/updateUser.dto';
import { Users } from '../../plugins/database/entities/users.entity';
import { UserOnlineStatus } from '../../plugins/database/enums';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async getAllUsers() {
    return await this.usersRepository.find();
  }

  async getUserById(userId: number) {
    const user = await this.usersRepository.findOne(userId);
    if (user) {
      return user;
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  async getUserByQuery(query) {
    return await this.usersRepository.findOne(query);
  }

  async getUsersByQuery(query) {
    return await this.usersRepository.find(query);
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

  async userLogIn(userId: number) {
    return await this.usersRepository.update(userId, {
      userOnlineStatus: UserOnlineStatus.ONLINE,
    });
  }

  async userLogOut(userId: number) {
    await this.usersRepository.update(userId, {
      userOnlineStatus: UserOnlineStatus.OFFLINE,
    });
  }

  async changeUserTheme(userId: number, { isDarkTheme }) {
    await this.usersRepository.update(userId, isDarkTheme);
    const updatedUser = await this.usersRepository.findOne(userId);
    if (updatedUser) {
      return updatedUser;
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  async deleteUser(userId: number) {
    const deleteResponse = await this.usersRepository.delete(userId);
    if (!deleteResponse.affected) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }
}
