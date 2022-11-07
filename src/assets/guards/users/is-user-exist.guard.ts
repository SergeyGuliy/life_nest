import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { ErrorService } from '@modules-helpers/global-services/error-handler.service';

import { UsersManager } from '@modules-helpers/entities-services/users/users.service';

@Injectable()
export class IsUserExistGuard implements CanActivate {
  @Inject(UsersManager)
  private readonly usersManager: UsersManager;
  @Inject(ErrorService)
  private readonly errorService: ErrorService;

  async canActivate(context: ExecutionContext) {
    const { userId } = context.switchToHttp().getRequest().params;

    const user = await this.usersManager.db.findOne(userId);
    if (!user) this.errorService.e('userNotFound', 'en');

    return true;
  }
}
