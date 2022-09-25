import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ErrorHandlerService } from '../../../sub_modules/globalServices/error-handler.service';
import { RoomsManagerService } from '../../../sub_modules/entitiesManagers/rooms/rooms.service';

@Injectable()
export class IsRoomBlockedGuard implements CanActivate {
  constructor(
    private readonly roomsManagerService: RoomsManagerService,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const { params } = context.switchToHttp().getRequest();
    const { roomId } = params;

    const { isBlocked } = await this.roomsManagerService.findOne(roomId);

    if (isBlocked) {
      this.errorHandlerService.error('roomIsBLocked', 'en');
    }
    return true;
  }
}
