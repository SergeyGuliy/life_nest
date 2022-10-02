import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';

import { ErrorHandlerService } from '@modules-helpers/global-services/error-handler.service';
import { UsersManagerService } from '@modules-helpers/entities-services/users/users.service';

@Injectable()
export class CanSendFriendshipRequestGuard implements CanActivate {
  @Inject(UsersManagerService)
  private readonly userManagerService: UsersManagerService;
  @Inject(ErrorHandlerService)
  private readonly errorHandlerService: ErrorHandlerService;

  async canActivate(context: ExecutionContext): Promise<any> {
    const { user, params } = context.switchToHttp().getRequest();

    const senderId = user.userId;
    const receiverId = params.userId;

    if (+senderId === +receiverId) {
      this.errorHandlerService.error('cantSendRequestToYourself', 'en');
    }
    const receiverUserData = await this.userManagerService.findOne(receiverId);
    if (!receiverUserData) {
      this.errorHandlerService.error('friendshipReceiverNotFound', 'en', [
        receiverId,
      ]);
    }

    return true;
  }
}
