import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';

import { ErrorService } from '../../../modules-helpers/global-services/error-handler.service.js';
import { UsersManager } from '../../../modules-helpers/entities-services/users/users.service.js';

@Injectable()
export class UserCanBeCreatedGuard implements CanActivate {
  @Inject(UsersManager)
  private readonly usersManager: UsersManager;
  @Inject(ErrorService)
  private readonly errorService: ErrorService;

  async canActivate(context: ExecutionContext): Promise<any> {
    const { email, phone } = context.switchToHttp().getRequest().body;

    const userSearchEmail = await this.usersManager.db.findOne({
      where: [{ email }],
    });
    const userSearchPhone = await this.usersManager.db.findOne({
      where: [{ phone }],
    });
    if (userSearchEmail && userSearchPhone) {
      this.errorService.e('phoneAndEmailAlreadyInUse', 'en');
    } else if (userSearchEmail) {
      this.errorService.e('emailAlreadyInUse', 'en');
    } else if (userSearchPhone) {
      this.errorService.e('phoneAlreadyInUse', 'en');
    }
    return true;
  }
}
