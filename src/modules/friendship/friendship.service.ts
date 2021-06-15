import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FRIENDSHIP_STATUSES } from '../assets/database/enums';

import { Friendships } from '../assets/database/entities/friendships.entity';
import { Users } from '../assets/database/entities/users.entity';

@Injectable()
export class FriendshipService {
  constructor(
    @InjectRepository(Friendships)
    private friendshipRepository: Repository<Friendships>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async getAllFriendship() {
    return await this.friendshipRepository.find({
      relations: ['friendshipReceiver', 'friendshipSender'],
    });
  }

  async sendRequest(yourId: number, receiverId: number) {
    await this.interceptor(yourId, receiverId);

    const friendships = await this.getBothFriendshipConnection(
      yourId,
      receiverId,
    );
    if (!friendships) {
      await this.friendshipRepository.save({
        friendshipReceiver: { userId: receiverId },
        friendshipSender: { userId: yourId },
      });
      return await this.getBothFriendshipConnection(yourId, receiverId);
    }
    throw new HttpException(
      {
        message: `Friendship connection is in status ${friendships.friendshipsStatus}`,
        friendships,
      },
      HttpStatus.METHOD_NOT_ALLOWED,
    );
  }

  async acceptRequest(yourId: number, senderId: number) {
    await this.interceptor(yourId, senderId);

    const friendships = await this.getYourFriendshipConnection(
      yourId,
      senderId,
    );
    if (!friendships) {
      throw new HttpException(
        `You don't have request from user with ID: ${senderId}`,
        HttpStatus.NOT_FOUND,
      );
    }
    if (friendships.friendshipsStatus === FRIENDSHIP_STATUSES.APPROVED) {
      throw new HttpException(
        `User is already in your friends list`,
        HttpStatus.METHOD_NOT_ALLOWED,
      );
    }
    if (yourId === +friendships.friendshipReceiver) {
      await this.friendshipRepository.update(friendships.friendshipsId, {
        friendshipsStatus: FRIENDSHIP_STATUSES.APPROVED,
      });
      return this.friendshipRepository.findOne({
        where: {
          friendshipsId: friendships.friendshipsId,
        },
        relations: ['friendshipReceiver', 'friendshipSender'],
      });
    } else {
      throw new HttpException(
        `Accept friendship connection can only receiver`,
        HttpStatus.METHOD_NOT_ALLOWED,
      );
    }
  }

  async ignoreRequest(yourId: number, receiverId: number) {
    await this.interceptor(yourId, receiverId);

    const friendships = await this.getYourFriendshipConnection(
      yourId,
      receiverId,
    );
    if (!friendships) {
      throw new HttpException(
        `You don't have request from user with ID: ${receiverId}`,
        HttpStatus.NOT_FOUND,
      );
    }
    if (friendships.friendshipsStatus === FRIENDSHIP_STATUSES.APPROVED) {
      throw new HttpException(
        `User is already in your friends list`,
        HttpStatus.METHOD_NOT_ALLOWED,
      );
    }
    if (yourId === +friendships.friendshipReceiver) {
      await this.friendshipRepository.update(friendships.friendshipsId, {
        friendshipsStatus: FRIENDSHIP_STATUSES.IGNORED,
      });
      return this.friendshipRepository.findOne({
        where: {
          friendshipsId: friendships.friendshipsId,
        },
        relations: ['friendshipReceiver', 'friendshipSender'],
      });
    } else {
      throw new HttpException(
        `Ignore friendship connection can only receiver`,
        HttpStatus.METHOD_NOT_ALLOWED,
      );
    }
  }

  async deleteFriendship(yourId: number, targetId: number) {
    await this.interceptor(yourId, targetId);
    const friendships = await this.getBothFriendshipConnection(
      yourId,
      targetId,
    );
    if (
      !friendships ||
      friendships.friendshipsStatus !== FRIENDSHIP_STATUSES.APPROVED
    ) {
      throw new HttpException(
        `You can't delete user if he is not in your friends list`,
        HttpStatus.METHOD_NOT_ALLOWED,
      );
    }
    await this.friendshipRepository.delete(friendships.friendshipsId);
    return {
      userId: targetId,
      friendshipsId: friendships.friendshipsId,
    };
  }

  async getBothFriendshipConnection(senderId: number, receiverId: number) {
    return await this.friendshipRepository.findOne({
      where: [
        {
          friendshipReceiver: { userId: receiverId },
          friendshipSender: { userId: senderId },
        },
        {
          friendshipReceiver: { userId: senderId },
          friendshipSender: { userId: receiverId },
        },
      ],
      loadRelationIds: true,
    });
  }

  async getYourFriends(yourId: number) {
    return await this.friendshipRepository.find({
      where: [
        {
          friendshipReceiver: {
            userId: yourId,
          },
          friendshipsStatus: FRIENDSHIP_STATUSES.APPROVED,
        },
        {
          friendshipSender: {
            userId: yourId,
          },
          friendshipsStatus: FRIENDSHIP_STATUSES.APPROVED,
        },
      ],
      relations: ['friendshipReceiver', 'friendshipSender'],
    });
  }

  async getYouRequests(yourId: number) {
    return await this.friendshipRepository.find({
      where: [
        {
          friendshipReceiver: {
            userId: yourId,
          },
          friendshipsStatus: FRIENDSHIP_STATUSES.PENDING,
        },
        {
          friendshipSender: {
            userId: yourId,
          },
          friendshipsStatus: FRIENDSHIP_STATUSES.PENDING,
        },
        {
          friendshipReceiver: {
            userId: yourId,
          },
          friendshipsStatus: FRIENDSHIP_STATUSES.IGNORED,
        },
        {
          friendshipSender: {
            userId: yourId,
          },
          friendshipsStatus: FRIENDSHIP_STATUSES.IGNORED,
        },
      ],
      relations: ['friendshipReceiver', 'friendshipSender'],
    });
  }

  async getYourFriendshipConnection(yourId, senderId) {
    return await this.friendshipRepository.findOne({
      where: [
        {
          friendshipReceiver: { userId: yourId },
          friendshipSender: { userId: senderId },
        },
      ],
      loadRelationIds: true,
    });
  }

  async interceptor(senderId: number, receiverId: number) {
    if (senderId === receiverId) {
      throw new HttpException(
        `You can't sent friendship request to yourself`,
        HttpStatus.NOT_FOUND,
      );
    }
    const user = await this.usersRepository.findOne(receiverId);
    if (!user) {
      throw new HttpException(
        `Friendship receiver with userId ${receiverId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
