import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ErrorHandlerService } from '../../../sub_modules/globalServices/error-handler.service';
import { RoomsManagerService } from '../../../sub_modules/entitiesManagers/rooms/rooms.service';

import { ROOM_TYPES } from '@enums/index.js';

@Injectable()
export class PasswordValidationGuard implements CanActivate {
  constructor(
    private readonly roomsManagerService: RoomsManagerService,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const { params, body } = context.switchToHttp().getRequest();
    const { roomId } = params;
    const { roomPassword } = body;

    const roomData = await this.roomsManagerService.findOne(roomId);

    if (
      roomData.typeOfRoom === ROOM_TYPES.PRIVATE &&
      roomData.roomPassword !== roomPassword
    ) {
      this.errorHandlerService.error('wrongRoomPassword', 'en');
    }
    return true;
  }
}
