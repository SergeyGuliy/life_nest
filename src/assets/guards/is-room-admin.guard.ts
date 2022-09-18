import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserManagerService } from '../../sub_modules/entitiesManagers/users/user.service';
import { ErrorHandlerService } from '../../sub_modules/globalServices/error-handler.service';

@Injectable()
export class IsRoomAdminGuard implements CanActivate {
  constructor(
    private readonly userManagerService: UserManagerService,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const { params, user } = context.switchToHttp().getRequest();
    const { userId } = user;
    const { roomId } = params;

    const { roomCreatedId } = await this.userManagerService.findOne({
      where: { userId },
    });

    if (+roomCreatedId === +roomId) return true;

    this.errorHandlerService.error('isNotRoomAdmin', 'en');
  }
}
