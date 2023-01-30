import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';

import { ErrorService } from '../../../modules-helpers/global-services/error-handler.service.js';
import { RoomsManager } from '../../../modules-helpers/entities-services/rooms/rooms.service.js';

import { ROOM_TYPES } from 'life_shared/enums/index.js';

@Injectable()
export class PasswordGuard implements CanActivate {
  @Inject(RoomsManager)
  private readonly roomsManager: RoomsManager;
  @Inject(ErrorService)
  private readonly errorService: ErrorService;

  async canActivate(context: ExecutionContext) {
    const { params, body } = context.switchToHttp().getRequest();
    const { roomId } = params;
    const { roomPassword } = body;

    const roomData = await this.roomsManager.db.findOne(roomId);

    if (
      roomData.typeOfRoom === ROOM_TYPES.PRIVATE &&
      roomData.roomPassword !== roomPassword
    ) {
      this.errorService.e('wrongRoomPassword', 'en');
    }
    return true;
  }
}
