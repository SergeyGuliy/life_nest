import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Friendships } from './friendships.entity';

@Injectable()
export class FriendshipManagerService {
  @InjectRepository(Friendships)
  private readonly friendshipRepository: Repository<Friendships>;

  public async save(query) {
    return await this.friendshipRepository.save(query);
  }

  public async update(friendshipId, newData) {
    return await this.friendshipRepository.update(friendshipId, newData);
  }

  public async findOne(query) {
    return this.friendshipRepository.findOne(query);
  }

  public async find(query) {
    return await this.friendshipRepository.find(query);
  }

  public async delete(friendshipsId) {
    return this.friendshipRepository.delete(friendshipsId);
  }

  public async getBothFriendshipConnection(
    senderId: number,
    receiverId: number,
  ) {
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

  public async getYourFriendshipConnection(yourId, senderId) {
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
}
