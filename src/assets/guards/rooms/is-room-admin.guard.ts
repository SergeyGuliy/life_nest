import {Injectable, CanActivate, ExecutionContext, Inject} from '@nestjs/common';
import { UsersManagerService } from '@modules-helpers/entities-services/users/users.service';
import { ErrorHandlerService } from '@modules-helpers/global-services/error-handler.service';

@Injectable()
export class IsRoomAdminGuard implements CanActivate {
  @Inject(UsersManagerService)
  private readonly userManagerService: UsersManagerService
  @Inject(ErrorHandlerService)
  private readonly errorHandlerService: ErrorHandlerService

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
