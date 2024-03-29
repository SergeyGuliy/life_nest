import { Inject, Injectable } from '@nestjs/common';
import { debounce } from 'throttle-debounce';

import { SocketNameSpacerService } from '../global-services/socket-namespaser.service.js';
import { RoomsService } from '../../modules/rooms/rooms.service.js';
import { UsersManager } from '../entities-services/users/users.service.js';
import { ErrorService } from '../global-services/error-handler.service.js';

import { USER_ONLINE_STATUSES } from 'life_shared/enums/index.js';
import { LOGOUT_TIMEOUT } from 'life_shared/constants/index.js';

@Injectable()
export class SocketService {
  @Inject(ErrorService)
  private readonly errorService: ErrorService;
  @Inject(RoomsService)
  private readonly roomsService: RoomsService;
  @Inject(SocketNameSpacerService)
  private readonly socketNameSpacerService: SocketNameSpacerService;
  @Inject(UsersManager)
  private readonly usersManager: UsersManager;

  private async logOutUserFormApp(userId) {
    const newUserSid = this.socketNameSpacerService.findSidByUserId(userId);
    if (!newUserSid) {
      await this.userLogOut(userId);
      const newUserData = await this.getUserById(userId);
      await this.roomsService.userLeaveRoom(newUserData);
    }
  }

  private async userLogOut(userId: number) {
    await this.usersManager.db.update(userId, {
      userOnlineStatus: USER_ONLINE_STATUSES.OFFLINE,
    });
  }

  private async getUserById(userId: number) {
    const user = await this.usersManager.db.findOne(userId);
    if (!user) this.errorService.e('userNotFound', 'en');

    return user;
  }

  public async userLogIn(userId: number) {
    return await this.usersManager.db.update(userId, {
      userOnlineStatus: USER_ONLINE_STATUSES.ONLINE,
    });
  }
  public logOutUserFormAppTimeout = debounce(LOGOUT_TIMEOUT, async (userId) => {
    await this.logOutUserFormApp(userId);
  });
}
