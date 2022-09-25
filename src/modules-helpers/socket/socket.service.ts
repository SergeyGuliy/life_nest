import { Injectable } from '@nestjs/common';
import { debounce } from 'throttle-debounce';

import { USER_ONLINE_STATUSES } from '@enums/index.js';

import { RoomsService } from '@modules/rooms/rooms.service';

import { SocketNameSpacerService } from '../global-services/socket-namespaser.service';
import { UsersManagerService } from '../entities-services/users/users.service';
import { ErrorHandlerService } from '../global-services/error-handler.service';
import { LOGOUT_TIMEOUT } from '@constants/index.js';

@Injectable()
export class SocketService {
  constructor(
    private readonly errorHandlerService: ErrorHandlerService,
    private roomsService: RoomsService,
    private socketNameSpacerService: SocketNameSpacerService,

    private userManagerService: UsersManagerService,
  ) {}

  private async logOutUserFormApp(userId) {
    const newUserSid = this.socketNameSpacerService.findSidByUserId(userId);
    if (!newUserSid) {
      await this.userLogOut(userId);
      const newUserData = await this.getUserById(userId);
      await this.roomsService.userLeaveRoom(newUserData);
    }
  }

  private async userLogOut(userId: number) {
    await this.userManagerService.update(userId, {
      userOnlineStatus: USER_ONLINE_STATUSES.OFFLINE,
    });
  }

  private async getUserById(userId: number) {
    const user = await this.userManagerService.findOne(userId);
    if (user) {
      return user;
    }
    this.errorHandlerService.error('userNotFound', 'en');
  }

  public async userLogIn(userId: number) {
    return await this.userManagerService.update(userId, {
      userOnlineStatus: USER_ONLINE_STATUSES.ONLINE,
    });
  }
  public logOutUserFormAppTimeout = debounce(LOGOUT_TIMEOUT, async (userId) => {
    await this.logOutUserFormApp(userId);
  });
}
