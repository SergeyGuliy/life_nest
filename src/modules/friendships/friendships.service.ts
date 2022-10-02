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

  private async getBothFriendshipConnection(
    senderId: number,
    receiverId: number,
  ) {
    return await this.friendshipManagerService.findOne({
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
  private async getYourFriendshipConnection(yourId, senderId) {
    return await this.friendshipManagerService.findOne({
      where: [
        {
          friendshipReceiver: { userId: yourId },
          friendshipSender: { userId: senderId },
        },
      ],
      loadRelationIds: true,
    });
  }

  public async getAllFriendship() {
    return await this.friendshipManagerService.find({
      relations: ['friendshipReceiver', 'friendshipSender'],
    });
  }

  public async sendRequest(yourId: number, receiverId: number) {
    const friendships = await this.getBothFriendshipConnection(
      yourId,
      receiverId,
    );
    if (!friendships) {
      await this.friendshipManagerService.save({
        friendshipReceiver: { userId: receiverId },
        friendshipSender: { userId: yourId },
      });
      return await this.getBothFriendshipConnection(yourId, receiverId);
    }
    return '';
    // this.errorHandlerService.error('friendshipsInStatus', 'en', [
    //   friendships.friendshipsStatus,
    // ]);
  }

  public async acceptRequest(yourId: number, senderId: number) {
    const friendships = await this.getYourFriendshipConnection(
      yourId,
      senderId,
    );
    if (!friendships) {
      this.errorHandlerService.error('youDontHaveRequest', 'en', [senderId]);
    }
    if (friendships.friendshipsStatus === FRIENDSHIP_STATUSES.APPROVED) {
      this.errorHandlerService.error('userAlreadyInFriends', 'en');
    }
    if (yourId === +friendships.friendshipReceiver) {
      await this.friendshipManagerService.update(friendships.friendshipsId, {
        friendshipsStatus: FRIENDSHIP_STATUSES.APPROVED,
      });
      return this.friendshipManagerService.findOne({
        where: {
          friendshipsId: friendships.friendshipsId,
        },
        relations: ['friendshipReceiver', 'friendshipSender'],
      });
    } else {
      this.errorHandlerService.error('acceptFriendshipCanOnlyReceiver', 'en');
    }
  }

  public async ignoreRequest(yourId: number, receiverId: number) {
    const friendships = await this.getYourFriendshipConnection(
      yourId,
      receiverId,
    );
    if (!friendships) {
      this.errorHandlerService.error('youDontHaveRequest', 'en', [receiverId]);
    }
    if (friendships.friendshipsStatus === FRIENDSHIP_STATUSES.APPROVED) {
      this.errorHandlerService.error('userAlreadyInFriends', 'en');
    }
    if (yourId === +friendships.friendshipReceiver) {
      await this.friendshipManagerService.update(friendships.friendshipsId, {
        friendshipsStatus: FRIENDSHIP_STATUSES.IGNORED,
      });
      return this.friendshipManagerService.findOne({
        where: {
          friendshipsId: friendships.friendshipsId,
        },
        relations: ['friendshipReceiver', 'friendshipSender'],
      });
    } else {
      this.errorHandlerService.error('ignoreCanOnlyReceiver', 'en');
    }
  }

  public async deleteFriendship(yourId: number, targetId: number) {
    const friendships = await this.getBothFriendshipConnection(
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
}
