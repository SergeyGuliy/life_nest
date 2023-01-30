import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Users } from './users.entity.js';

@Injectable()
export class UsersManager {
  @InjectRepository(Users)
  public readonly db: Repository<Users>;

  public async fetchSecuredUserData(userId) {
    return await this.db.findOne(userId, {
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
    return await this.db
      .createQueryBuilder('user')
      .select(['user.phone', 'user.email', 'user.password', 'user.userId'])
      .where('user.email = :email', { email })
      .orWhere('user.phone = :phone', { phone })
      .orWhere('user.userId = :userId', { userId })
      .getOne();
  }

  public getUsersInRoom(roomId) {
    return this.db.find({
      where: { roomJoinedId: roomId },
    });
  }
}
