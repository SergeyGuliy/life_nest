import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ErrorHandlerService } from '../../../modules-helpers/global-services/error-handler.service';
import { RoomsManagerService } from '../../../modules-helpers/entities-services/rooms/rooms.service';

import { UsersManagerService } from '../../../modules-helpers/entities-services/users/users.service';

@Injectable()
export class CountOfUsersValidationGuard implements CanActivate {
  constructor(
    private readonly roomsManagerService: RoomsManagerService,
    private readonly userManagerService: UsersManagerService,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const { params } = context.switchToHttp().getRequest();
    const { roomId } = params;

    const { maxCountOfUsers } = await this.roomsManagerService.findOne(roomId);

    const usersInRoom = await this.userManagerService.find({
      where: { roomJoinedId: roomId },
    });

    if (usersInRoom.length > maxCountOfUsers) {
      this.errorHandlerService.error('roomAlreadyFull', 'en');
    }
    return true;
  }
}
