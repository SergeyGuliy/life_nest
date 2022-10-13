import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { ErrorHandlerService } from '@modules-helpers/global-services/error-handler.service';

import { UsersManager } from '@modules-helpers/entities-services/users/users.service';
import { PasswordEncoderService } from '@modules/auth/password-encoder.service';

@Injectable()
export class ValidateLoginPasswordGuard implements CanActivate {
  @Inject(UsersManager)
  private readonly usersManager: UsersManager;
  @Inject(ErrorHandlerService)
  private readonly errorHandlerService: ErrorHandlerService;
  @Inject(PasswordEncoderService)
  private readonly passwordEncoderService: PasswordEncoderService;

  async canActivate(context: ExecutionContext): Promise<any> {
    const { body } = context.switchToHttp().getRequest();
    const { password, email } = body;

    const userData = await this.usersManager.getUserByEmailOrPhoneOrId({
      email,
    });

    await this.passwordEncoderService.validatePassword(
      {
        bodyPassword: password,
        userPassword: userData.password,
      },
      () => {
        this.errorHandlerService.error('wrongPasswordOrLogin', 'en');
      },
    );

    return true;
  }
}
