import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';

import { ErrorHandlerService } from '@modules-helpers/global-services/error-handler.service';

import { FriendshipManagerService } from '@modules-helpers/entities-services/friendships/friendships.service';
import { FRIENDSHIP_STATUSES } from '../../../../../life_shared/enums';

@Injectable()
export class DeleteFriendshipGuard implements CanActivate {
  @Inject(FriendshipManagerService)
  private readonly friendshipManagerService: FriendshipManagerService;
  @Inject(ErrorHandlerService)
  private readonly errorHandlerService: ErrorHandlerService;

  async canActivate(context: ExecutionContext): Promise<any> {
    const { user, params } = context.switchToHttp().getRequest();

    const senderId = user.userId;
    const receiverId = params.userId;

    const friendships = await this.friendshipManagerService.getBothFriendshipConnection(
      senderId,
      receiverId,
    );
    if (
      !friendships ||
      friendships.friendshipsStatus !== FRIENDSHIP_STATUSES.APPROVED
    ) {
      this.errorHandlerService.error('cantDeleteIfUserNotInFriendList', 'en');
    }

    return true;
  }
}
