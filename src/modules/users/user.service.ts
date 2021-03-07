import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

import { Users } from '../../plugins/database/entities/user.entity';
import {
  generatePasswordHash,
  checkPassword,
} from '../../plugins/helpers/password-encoder';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const phone = require('phone');

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
    const updatedPost = await this.usersRepository.findOne(id);
    if (updatedPost) {
      return updatedPost;
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  async createUser(user: CreateUserDto) {
    user.phoneCountryCode = phone(user.phone)[1];
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
