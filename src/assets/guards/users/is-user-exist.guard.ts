import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { ErrorHandlerService } from '@modules-helpers/global-services/error-handler.service';

import { UsersManagerService } from '@modules-helpers/entities-services/users/users.service';

@Injectable()
export class IsUserExistGuard implements CanActivate {
  @Inject(UsersManagerService)
  private readonly usersManagerService: UsersManagerService;
  @Inject(ErrorHandlerService)
  private errorHandlerService: ErrorHandlerService;

  async canActivate(context: ExecutionContext) {
    const { userId } = context.switchToHttp().getRequest().params;

    const user = await this.usersManagerService.findOne(userId);
    if (!user) this.errorHandlerService.error('userNotFound', 'en');

    return true;
  }
}
