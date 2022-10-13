import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { ErrorHandlerService } from '@modules-helpers/global-services/error-handler.service';

import { UsersManager } from '@modules-helpers/entities-services/users/users.service';

@Injectable()
export class UserCanBeCreatedGuard implements CanActivate {
  @Inject(UsersManager)
  private readonly usersManager: UsersManager;
  @Inject(ErrorHandlerService)
  private readonly errorHandlerService: ErrorHandlerService;

  async canActivate(context: ExecutionContext): Promise<any> {
    const { email, phone } = context.switchToHttp().getRequest().body;

    const userSearchEmail = await this.usersManager.db.findOne({
      where: [{ email }],
    });
    const userSearchPhone = await this.usersManager.db.findOne({
      where: [{ phone }],
    });
    if (userSearchEmail && userSearchPhone) {
      this.errorHandlerService.error('phoneAndEmailAlreadyInUse', 'en');
    } else if (userSearchEmail) {
      this.errorHandlerService.error('emailAlreadyInUse', 'en');
    } else if (userSearchPhone) {
      this.errorHandlerService.error('phoneAlreadyInUse', 'en');
    }
    return true;
  }
}
