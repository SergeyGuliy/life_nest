import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';

import { ErrorHandlerService } from '@modules-helpers/global-services/error-handler.service';
import { UsersManager } from '@modules-helpers/entities-services/users/users.service';

@Injectable()
export class CanSendFriendshipRequestGuard implements CanActivate {
  @Inject(UsersManager)
  private readonly usersManager: UsersManager;
  @Inject(ErrorHandlerService)
  private readonly errorHandlerService: ErrorHandlerService;

  async canActivate(context: ExecutionContext): Promise<any> {
    const { user, params } = context.switchToHttp().getRequest();

    const senderId = user.userId;
    const receiverId = params.userId;

    if (+senderId === +receiverId) {
      this.errorHandlerService.error('cantSendRequestToYourself', 'en');
    }
    const receiverUserData = await this.usersManager.db.findOne(receiverId);
    if (!receiverUserData) {
      this.errorHandlerService.error('friendshipReceiverNotFound', 'en', [
        receiverId,
      ]);
    }

    return true;
  }
}
