import { Inject, Injectable } from '@nestjs/common';

import { FRIENDSHIP_STATUSES } from '@enums/index.js';

import { FriendshipManagerService } from '@modules-helpers/entities-services/friendships/friendships.service';

@Injectable()
export class FriendshipsService {
  @Inject(FriendshipManagerService)
  private readonly friendshipManagerService: FriendshipManagerService;

  private async setStatusForFriendship(yourId, receiverId, status) {
    const {
      friendshipsId,
    } = await this.friendshipManagerService.getYourFriendshipConnection(
      yourId,
      receiverId,
    );
    await this.friendshipManagerService.update(friendshipsId, {
      friendshipsStatus: FRIENDSHIP_STATUSES.IGNORED,
    });
    return await this.friendshipManagerService.findOne({
      where: { friendshipsId },
      relations: ['friendshipReceiver', 'friendshipSender'],
    });
  }

  public async getAllFriendship() {
    return await this.friendshipManagerService.find({
      relations: ['friendshipReceiver', 'friendshipSender'],
    });
  }

  public async getYourFriends(yourId: number) {
    return await this.friendshipManagerService.find({
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
    return await this.friendshipManagerService.find({
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
    await this.friendshipManagerService.save({
      friendshipReceiver: { userId: receiverId },
      friendshipSender: { userId: yourId },
    });
    return await this.friendshipManagerService.getBothFriendshipConnection(
      yourId,
      receiverId,
    );
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
    const {
      friendshipsId,
    } = await this.friendshipManagerService.getBothFriendshipConnection(
      yourId,
      targetId,
    );
    await this.friendshipManagerService.delete(friendshipsId);
    return {
      userId: targetId,
      friendshipsId,
    };
  }
}
