import { Injectable } from '@nestjs/common';

import { USER_ONLINE_STATUSES } from '@enums/index.js';

import { RoomsService } from '../../modules/rooms/rooms.service';

import { SocketNameSpacerService } from '../globalServices/socket-namespaser.service';
import { UserManagerService } from '../entitiesManagers/users/user.service';
import { ErrorHandlerService } from '../globalServices/error-handler.service';

@Injectable()
export class SocketService {
  constructor(
    private readonly errorHandlerService: ErrorHandlerService,
    private roomsService: RoomsService,
    private socketNameSpacerService: SocketNameSpacerService,

    private userManagerService: UserManagerService,
  ) {}

  async logOutUserFormApp(userId) {
    const newUserSid = this.socketNameSpacerService.findSidByUserId(userId);
    if (!newUserSid) {
      await this.userLogOut(userId);
      const newUserData = await this.getUserById(userId);
      await this.roomsService.userLeaveRoom(newUserData);
    }
  }

  async userLogIn(userId: number) {
    return await this.userManagerService.update(userId, {
      userOnlineStatus: USER_ONLINE_STATUSES.ONLINE,
    });
  }

  async userLogOut(userId: number) {
    await this.userManagerService.update(userId, {
      userOnlineStatus: USER_ONLINE_STATUSES.OFFLINE,
    });
  }

  async getUserById(userId: number) {
    const user = await this.userManagerService.findOne(userId);
    if (user) {
      return user;
    }
    this.errorHandlerService.error('userNotFound', 'en');
  }
}
