import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ErrorHandlerService } from '../../../sub_modules/globalServices/error-handler.service';
import { RoomsManagerService } from '../../../sub_modules/entitiesManagers/rooms/rooms.service';

import { ROOM_TYPES } from '@enums/index.js';
import { UserManagerService } from '../../../sub_modules/entitiesManagers/users/user.service';

@Injectable()
export class CountOfUsersValidationGuard implements CanActivate {
  constructor(
    private readonly roomsManagerService: RoomsManagerService,
    private readonly userManagerService: UserManagerService,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const { params } = context.switchToHttp().getRequest();
    const { roomId } = params;

    const { maxCountOfUsers } = await this.roomsManagerService.findOne(roomId);

    const usersInRoom = await this.userManagerService.find({
      where: { roomJoinedId: roomId },
    });

    console.log('CountOfUsersValidationGuard')
    console.log(usersInRoom.length)
    console.log(maxCountOfUsers)

    if (usersInRoom.length > maxCountOfUsers) {
      this.errorHandlerService.error('roomAlreadyFull', 'en');
    }
    return true;
  }
}
