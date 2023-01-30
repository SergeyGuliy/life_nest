import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';

import { UsersManager } from '../../../modules-helpers/entities-services/users/users.service.js';
import { ErrorService } from '../../../modules-helpers/global-services/error-handler.service.js';

@Injectable()
export class IsRoomAdminGuard implements CanActivate {
  @Inject(UsersManager)
  private readonly usersManager: UsersManager;
  @Inject(ErrorService)
  private readonly errorService: ErrorService;

  async canActivate(context: ExecutionContext) {
    const { params, user } = context.switchToHttp().getRequest();
    const { userId } = user;
    const { roomId } = params;

    const { roomCreatedId } = await this.usersManager.db.findOne({
      where: { userId },
    });

    if (+roomCreatedId === +roomId) return true;

    this.errorService.e('isNotRoomAdmin', 'en');
  }
}
