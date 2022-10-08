import { Inject, Injectable } from '@nestjs/common';

import { FRIENDSHIP_STATUSES } from '@enums/index.js';

import { FriendshipManager } from '@modules-helpers/entities-services/friendships/friendships.service';

@Injectable()
export class FriendshipsService {
  @Inject(FriendshipManager)
  private readonly friendshipManager: FriendshipManager;

  private async setStatusForFriendship(yourId, receiverId, status) {
    const friendshipsId = await this.friendshipManager.getFriendshipID(
      yourId,
      receiverId,
    );
    await this.friendshipManager.db.update(friendshipsId, {
      friendshipsStatus: status,
    });
    return await this.friendshipManager.db.findOne({
      where: { friendshipsId },
      relations: ['friendshipReceiver', 'friendshipSender'],
    });
  }

  public async getAllFriendship() {
    return await this.friendshipManager.db.find({
      relations: ['friendshipReceiver', 'friendshipSender'],
    });
  }

  public async getYourFriends(yourId: number) {
    return await this.friendshipManager.db.find({
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

  public async getYouRequests(yourId: number) {
    return await this.friendshipManager.db.find({
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

  public async sendRequest(yourId: number, receiverId: number) {
    return await this.friendshipManager.saveAndReturn({
      yourId,
      receiverId,
    });
  }

  public acceptRequest(yourId: number, senderId: number) {
    return this.setStatusForFriendship(
      yourId,
      senderId,
      FRIENDSHIP_STATUSES.APPROVED,
    );
  }

  public ignoreRequest(yourId: number, receiverId: number) {
    return this.setStatusForFriendship(
      yourId,
      receiverId,
      FRIENDSHIP_STATUSES.IGNORED,
    );
  }

  public async deleteFriendship(yourId: number, targetId: number) {
    const friendshipsId = await this.friendshipManager.getFriendshipID(
      yourId,
      targetId,
    );
    await this.friendshipManager.db.delete(friendshipsId);
    return {
      userId: targetId,
      friendshipsId,
    };
  }
}
