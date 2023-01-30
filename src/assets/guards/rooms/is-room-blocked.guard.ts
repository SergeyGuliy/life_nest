import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';

import { ErrorService } from '../../../modules-helpers/global-services/error-handler.service.js';
import { RoomsManager } from '../../../modules-helpers/entities-services/rooms/rooms.service.js';

@Injectable()
export class RoomBlockedGuard implements CanActivate {
  @Inject(RoomsManager)
  private readonly roomsManager: RoomsManager;
  @Inject(ErrorService)
  private readonly errorService: ErrorService;

  async canActivate(context: ExecutionContext) {
    const { params } = context.switchToHttp().getRequest();
    const { roomId } = params;

    const { isBlocked } = await this.roomsManager.db.findOne(roomId);

    if (isBlocked) {
      this.errorService.e('roomIsBLocked', 'en');
    }
    return true;
  }
}
