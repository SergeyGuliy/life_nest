import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { ErrorHandlerService } from '@modules-helpers/global-services/error-handler.service';

import { UsersManagerService } from '@modules-helpers/entities-services/users/users.service';
import { PasswordEncoderService } from '@modules/auth/password-encoder.service';

@Injectable()
export class ValidateChangePasswordGuard implements CanActivate {
  @Inject(UsersManagerService)
  private readonly userManagerService: UsersManagerService;
  @Inject(ErrorHandlerService)
  private readonly errorHandlerService: ErrorHandlerService;
  @Inject(PasswordEncoderService)
  private readonly passwordEncoderService: PasswordEncoderService;

  async canActivate(context: ExecutionContext): Promise<any> {
    const { user, body } = context.switchToHttp().getRequest();
    const { oldPassword, newPassword, newPasswordRepeat } = body;

    if (newPassword !== newPasswordRepeat) {
      this.errorHandlerService.error('wrongPasswordOrLogin', 'en');
    }

    const userData = await this.userManagerService.getUserByEmailOrPhoneOrId({
      userId: user?.userId,
    });

    await this.passwordEncoderService.validatePassword(
      {
        bodyPassword: oldPassword,
        userPassword: userData.password,
      },
      () => {
        this.errorHandlerService.error('wrongPasswordOrLogin', 'en');
      },
    );

    return true;
  }
}