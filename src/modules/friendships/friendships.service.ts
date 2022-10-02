import { Injectable } from '@nestjs/common';

import { FRIENDSHIP_STATUSES } from '@enums/index.js';

import { FriendshipManagerService } from '@modules-helpers/entities-services/friendships/friendships.service';
import { UsersManagerService } from '@modules-helpers/entities-services/users/users.service';
import { ErrorHandlerService } from '@modules-helpers/global-services/error-handler.service';

@Injectable()
export class FriendshipsService {
  constructor(
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly friendshipManagerService: FriendshipManagerService,
    private readonly userManagerService: UsersManagerService,
  ) {}

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

  public async acceptRequest(yourId: number, senderId: number) {
    const {
      friendshipsId,
    } = await this.friendshipManagerService.getYourFriendshipConnection(
      yourId,
      senderId,
    );
    await this.friendshipManagerService.update(friendshipsId, {
      friendshipsStatus: FRIENDSHIP_STATUSES.APPROVED,
    });
    return this.friendshipManagerService.findOne({
      where: { friendshipsId },
      relations: ['friendshipReceiver', 'friendshipSender'],
    });
  }

  public async ignoreRequest(yourId: number, receiverId: number) {
    const {
      friendshipsId,
    } = await this.friendshipManagerService.getYourFriendshipConnection(
      yourId,
      receiverId,
    );
    await this.friendshipManagerService.update(friendshipsId, {
      friendshipsStatus: FRIENDSHIP_STATUSES.IGNORED,
    });
    return this.friendshipManagerService.findOne({
      where: { friendshipsId },
      relations: ['friendshipReceiver', 'friendshipSender'],
    });
  }

  public async deleteFriendship(yourId: number, targetId: number) {
    const friendships = await this.friendshipManagerService.getBothFriendshipConnection(
      yourId,
      targetId,
    );
    if (
      !friendships ||
      friendships.friendshipsStatus !== FRIENDSHIP_STATUSES.APPROVED
    ) {
      this.errorHandlerService.error('cantDeleteIfUserNotInFriendList', 'en');
    }
    await this.friendshipManagerService.delete(friendships.friendshipsId);
    return {
      userId: targetId,
      friendshipsId: friendships.friendshipsId,
    };
  }
}
