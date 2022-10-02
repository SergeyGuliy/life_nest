import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { ErrorHandlerService } from '@modules-helpers/global-services/error-handler.service';

import { UsersManagerService } from '@modules-helpers/entities-services/users/users.service';

@Injectable()
export class UserCanBeCreatedGuard implements CanActivate {
  @Inject(UsersManagerService)
  private readonly userManagerService: UsersManagerService;
  @Inject(ErrorHandlerService)
  private readonly errorHandlerService: ErrorHandlerService;

  async canActivate(context: ExecutionContext): Promise<any> {
    const { email, phone } = context.switchToHttp().getRequest().body;

    const userSearchEmail = await this.userManagerService.findOne({
      where: [{ email }],
    });
    const userSearchPhone = await this.userManagerService.findOne({
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
