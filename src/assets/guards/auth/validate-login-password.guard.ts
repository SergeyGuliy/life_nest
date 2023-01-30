import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';

import { ErrorService } from '../../../modules-helpers/global-services/error-handler.service.js';
import { UsersManager } from '../../../modules-helpers/entities-services/users/users.service.js';
import { PasswordEncoderService } from '../../../modules/auth/password-encoder.service.js';

@Injectable()
export class ValidateLoginPasswordGuard implements CanActivate {
  @Inject(UsersManager)
  private readonly usersManager: UsersManager;
  @Inject(ErrorService)
  private readonly errorService: ErrorService;
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
        this.errorService.e('wrongPasswordOrLogin', 'en');
      },
    );

    return true;
  }
}
