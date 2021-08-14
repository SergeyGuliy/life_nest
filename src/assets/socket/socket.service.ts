import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { USER_ONLINE_STATUSES } from '../../plugins/enums';

import { RoomsService } from '../../modules/rooms/rooms.service';

import { SocketNameSpacerService } from '../globalServices/socket-namespaser.service';
import { UserManagerService } from '../entitiesManagers/users/user.service';

@Injectable()
export class SocketService {
  constructor(
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
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }
}
