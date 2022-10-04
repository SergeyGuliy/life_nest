import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Users } from './users.entity';
import { ErrorHandlerService } from '../../global-services/error-handler.service';

@Injectable()
export class UsersManagerService {
  @Inject(ErrorHandlerService)
  private readonly errorHandlerService: ErrorHandlerService;
  @InjectRepository(Users)
  private readonly usersRepository: Repository<Users>;

  public async update(userId, newUserData) {
    await this.usersRepository.update(userId, newUserData);
  }

  public async find(condition = null) {
    return await this.usersRepository.find(condition);
  }

  public async findOne(condition) {
    return await this.usersRepository.findOne(condition);
  }

  public async save(userData) {
    return await this.usersRepository.save(userData);
  }

  public async delete(userId: number) {
    const deleteResponse = await this.usersRepository.delete(userId);
    if (!deleteResponse.affected) {
      this.errorHandlerService.error('userNotFound', 'en');
    }
  }

  public async getUserByIdWithToken(userId: number) {
    await this.catchUserNotExists(userId);
    return await this.fetchSecuredUserData(userId);
  }

  public async fetchSecuredUserData(userId) {
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
        'roomCreatedId',
        'roomJoinedId',
        'avatarSmall',
        'avatarBig',
      ],
      relations: ['userSettings'],
    });
  }

  public async getUserByEmailOrPhoneOrId({
    userId = 0,
    phone = '',
    email = '',
  }) {
    return await this.usersRepository
      .createQueryBuilder('user')
      .select(['user.phone', 'user.email', 'user.password', 'user.userId'])
      .where('user.email = :email', { email })
      .orWhere('user.phone = :phone', { phone })
      .orWhere('user.userId = :userId', { userId })
      .getOne();
  }

  public async catchUserNotExists(userId) {
    const user = await this.usersRepository.findOne(userId);
    if (!user) this.errorHandlerService.error('userNotFound', 'en');
  }
}
