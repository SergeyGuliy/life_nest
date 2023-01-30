import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';

import { ErrorService } from '../../../modules-helpers/global-services/error-handler.service.js';
import { UsersManager } from '../../../modules-helpers/entities-services/users/users.service.js';
import { AuthService } from '../../../modules/auth/auth.service.js';

@Injectable()
export class ValidateRevalidationTokenGuard implements CanActivate {
  @Inject(UsersManager)
  private readonly usersManager: UsersManager;
  @Inject(AuthService)
  private readonly authService: AuthService;
  @Inject(ErrorService)
  private readonly errorService: ErrorService;

  async canActivate(context: ExecutionContext): Promise<any> {
    const { body } = context.switchToHttp().getRequest();
    const { userId, refreshToken } = body;

    const userData = await this.usersManager.fetchSecuredUserData(userId);

    const oldRefreshToken = userData.refreshToken;

    if (refreshToken !== oldRefreshToken) {
      await this.authService.setNewRefreshTokenToUser(userId);
      this.errorService.e('invalidRefreshToken', 'en');
    }

    return true;
  }
}
