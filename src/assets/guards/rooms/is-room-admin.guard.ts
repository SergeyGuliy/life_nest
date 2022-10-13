import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { UsersManager } from '@modules-helpers/entities-services/users/users.service';
import { ErrorHandlerService } from '@modules-helpers/global-services/error-handler.service';

@Injectable()
export class IsRoomAdminGuard implements CanActivate {
  @Inject(UsersManager)
  private readonly usersManager: UsersManager;
  @Inject(ErrorHandlerService)
  private readonly errorHandlerService: ErrorHandlerService;

  async canActivate(context: ExecutionContext) {
    const { params, user } = context.switchToHttp().getRequest();
    const { userId } = user;
    const { roomId } = params;

    const { roomCreatedId } = await this.usersManager.db.findOne({
      where: { userId },
    });

    if (+roomCreatedId === +roomId) return true;

    this.errorHandlerService.error('isNotRoomAdmin', 'en');
  }
}
