import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { ErrorHandlerService } from '@modules-helpers/global-services/error-handler.service';
import { RoomsManager } from '@modules-helpers/entities-services/rooms/rooms.service';

@Injectable()
export class RoomBlockedGuard implements CanActivate {
  @Inject(RoomsManager)
  private readonly roomsManager: RoomsManager;
  @Inject(ErrorHandlerService)
  private readonly errorHandlerService: ErrorHandlerService;

  async canActivate(context: ExecutionContext) {
    const { params } = context.switchToHttp().getRequest();
    const { roomId } = params;

    const { isBlocked } = await this.roomsManager.db.findOne(roomId);

    if (isBlocked) {
      this.errorHandlerService.error('roomIsBLocked', 'en');
    }
    return true;
  }
}
