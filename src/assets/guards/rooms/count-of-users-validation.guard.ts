import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { ErrorHandlerService } from '@modules-helpers/global-services/error-handler.service';
import { RoomsManager } from '@modules-helpers/entities-services/rooms/rooms.service';

import { UsersManager } from '@modules-helpers/entities-services/users/users.service';

@Injectable()
export class CountOfUsersValidationGuard implements CanActivate {
  @Inject(RoomsManager)
  private readonly roomsManager: RoomsManager;
  @Inject(UsersManager)
  private readonly usersManager: UsersManager;
  @Inject(ErrorHandlerService)
  private readonly errorHandlerService: ErrorHandlerService;

  async canActivate(context: ExecutionContext) {
    const { params } = context.switchToHttp().getRequest();
    const { roomId } = params;

    const { maxCountOfUsers } = await this.roomsManager.db.findOne(roomId);

    const usersInRoom = await this.usersManager.db.find({
      where: { roomJoinedId: roomId },
    });

    if (usersInRoom.length > maxCountOfUsers) {
      this.errorHandlerService.error('roomAlreadyFull', 'en');
    }
    return true;
  }
}
