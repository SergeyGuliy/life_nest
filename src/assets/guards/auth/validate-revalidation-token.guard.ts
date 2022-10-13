import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { ErrorHandlerService } from '@modules-helpers/global-services/error-handler.service';

import { UsersManager } from '@modules-helpers/entities-services/users/users.service';
import { AuthService } from '@modules/auth/auth.service';

@Injectable()
export class ValidateRevalidationTokenGuard implements CanActivate {
  @Inject(UsersManager)
  private readonly usersManager: UsersManager;
  @Inject(AuthService)
  private readonly authService: AuthService;
  @Inject(ErrorHandlerService)
  private readonly errorHandlerService: ErrorHandlerService;

  async canActivate(context: ExecutionContext): Promise<any> {
    const { body } = context.switchToHttp().getRequest();
    const { userId, refreshToken } = body;

    const userData = await this.usersManager.fetchSecuredUserData(userId);

    const oldRefreshToken = userData.refreshToken;

    if (refreshToken !== oldRefreshToken) {
      await this.authService.setNewRefreshTokenToUser(userId);
      this.errorHandlerService.error('invalidRefreshToken', 'en');
    }

    return true;
  }
}
