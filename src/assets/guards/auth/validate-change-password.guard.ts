import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { ErrorService } from '@modules-helpers/global-services/error-handler.service';

import { UsersManager } from '@modules-helpers/entities-services/users/users.service';
import { PasswordEncoderService } from '@modules/auth/password-encoder.service';

@Injectable()
export class ValidateChangePasswordGuard implements CanActivate {
  @Inject(UsersManager)
  private readonly usersManager: UsersManager;
  @Inject(ErrorService)
  private readonly errorService: ErrorService;
  @Inject(PasswordEncoderService)
  private readonly passwordEncoderService: PasswordEncoderService;

  async canActivate(context: ExecutionContext): Promise<any> {
    const { user, body } = context.switchToHttp().getRequest();
    const { oldPassword, newPassword, newPasswordRepeat } = body;

    if (newPassword !== newPasswordRepeat) {
      this.errorService.e('wrongPasswordOrLogin', 'en');
    }

    const userData = await this.usersManager.getUserByEmailOrPhoneOrId({
      userId: user?.userId,
    });

    await this.passwordEncoderService.validatePassword(
      {
        bodyPassword: oldPassword,
        userPassword: userData.password,
      },
      () => {
        this.errorService.e('wrongPasswordOrLogin', 'en');
      },
    );

    return true;
  }
}
