import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';

import { ErrorService } from '@modules-helpers/global-services/error-handler.service';
import { UsersManager } from '@modules-helpers/entities-services/users/users.service';

@Injectable()
export class CanSendFriendshipRequestGuard implements CanActivate {
  @Inject(UsersManager)
  private readonly usersManager: UsersManager;
  @Inject(ErrorService)
  private readonly errorService: ErrorService;

  async canActivate(context: ExecutionContext): Promise<any> {
    const { user, params } = context.switchToHttp().getRequest();

    const senderId = user.userId;
    const receiverId = params.userId;

    if (+senderId === +receiverId) {
      this.errorService.e('cantSendRequestToYourself', 'en');
    }
    const receiverUserData = await this.usersManager.db.findOne(receiverId);
    if (!receiverUserData) {
      this.errorService.e('friendshipReceiverNotFound', 'en', [
        receiverId,
      ]);
    }

    return true;
  }
}
