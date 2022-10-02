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
export class ValidateLoginPasswordGuard implements CanActivate {
  @Inject(UsersManagerService)
  private readonly userManagerService: UsersManagerService;
  @Inject(ErrorHandlerService)
  private readonly errorHandlerService: ErrorHandlerService;
  @Inject(PasswordEncoderService)
  private readonly passwordEncoderService: PasswordEncoderService;

  async canActivate(context: ExecutionContext): Promise<any> {
    const { body } = context.switchToHttp().getRequest();
    const { password, email } = body;

    const userData = await this.userManagerService.getUserByEmailOrPhoneOrId({
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
