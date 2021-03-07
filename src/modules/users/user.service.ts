import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

import { Users } from '../../plugins/database/entities/user.entity';
import { generatePasswordHash } from '../../plugins/helpers/password-encoder';

import * as phone from 'phone';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async getAllUsers() {
    return await this.usersRepository.find();
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

  async createUser(user: CreateUserDto) {
    const formattedPhone = phone(user.phone);
    user.phoneCountryCode = formattedPhone[0];
    user.country = formattedPhone[1];
    user.password = await generatePasswordHash(user.password);
    const newUser = await this.usersRepository.create(user);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async deleteUser(id: number) {
    const deleteResponse = await this.usersRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }
}
