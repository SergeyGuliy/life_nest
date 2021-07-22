import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Users } from '../../../plugins/database/entities/users.entity';

@Injectable()
export class UserManagerService {
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

  async editUser(userId: number, user) {
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

  async getUserByEmailOrPhoneOrId({ userId, phone, email }) {
    return await this.usersRepository
      .createQueryBuilder('user')
      .select(['user.phone', 'user.email', 'user.password', 'user.userId'])
      .where('user.email = :email', { email })
      .orWhere('user.phone = :phone', { phone })
      .orWhere('user.userId = :userId', { userId })
      .getOne();
  }

  async updateUser(userId, newUserData) {
    await this.usersRepository.update(userId, newUserData);
  }

  async findOneUser(condition) {
    return await this.usersRepository.findOne(condition);
  }

  async saveUser(userData) {
    return await this.usersRepository.save(userData);
  }
}
