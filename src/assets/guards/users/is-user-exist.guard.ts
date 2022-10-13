import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { ErrorHandlerService } from '@modules-helpers/global-services/error-handler.service';

import { UsersManager } from '@modules-helpers/entities-services/users/users.service';

@Injectable()
export class IsUserExistGuard implements CanActivate {
  @Inject(UsersManager)
  private readonly usersManager: UsersManager;
  @Inject(ErrorHandlerService)
  private readonly errorHandlerService: ErrorHandlerService;

  async canActivate(context: ExecutionContext) {
    const { userId } = context.switchToHttp().getRequest().params;

    const user = await this.usersManager.db.findOne(userId);
    if (!user) this.errorHandlerService.error('userNotFound', 'en');

    return true;
  }
}
