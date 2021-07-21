import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UpdateUserDto } from './dto/updateUser.dto';
import { Users } from '../../plugins/database/entities/users.entity';
import { USER_ONLINE_STATUSES } from '../../plugins/database/enums';

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

  async editUser(userId: number, user: UpdateUserDto) {
    await this.usersRepository.update(userId, user);
    const updatedUser = await this.usersRepository.findOne(userId);
    if (updatedUser) {
      return updatedUser;
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
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
