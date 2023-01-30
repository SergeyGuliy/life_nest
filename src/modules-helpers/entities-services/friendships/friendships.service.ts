import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Friendships } from './friendships.entity.js';

@Injectable()
export class FriendshipManager {
  @InjectRepository(Friendships)
  public readonly db: Repository<Friendships>;

  public async saveAndReturn({ yourId, receiverId }) {
    await this.db.save({
      friendshipSender: { userId: yourId },
      friendshipReceiver: { userId: receiverId },
    });
    return await this.getFriendship(yourId, receiverId);
  }

  public async getFriendship(senderId: number, receiverId: number) {
    return await this.db.findOne({
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

  public async getFriendshipID(senderId: number, receiverId: number) {
    const { friendshipsId } = await this.getFriendship(senderId, receiverId);
    return friendshipsId;
  }

  public async getYourFriendships(yourId, senderId) {
    return await this.db.findOne({
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
