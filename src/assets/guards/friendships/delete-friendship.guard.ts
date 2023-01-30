import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';

import { ErrorService } from '../../../modules-helpers/global-services/error-handler.service.js';
import { FriendshipManager } from '../../../modules-helpers/entities-services/friendships/friendships.service.js';

import { FRIENDSHIP_STATUSES } from 'life_shared/enums/index.js';

@Injectable()
export class DeleteFriendshipGuard implements CanActivate {
  @Inject(FriendshipManager)
  private readonly friendshipManager: FriendshipManager;
  @Inject(ErrorService)
  private readonly errorService: ErrorService;

  async canActivate(context: ExecutionContext): Promise<any> {
    const { user, params } = context.switchToHttp().getRequest();

    const senderId = user.userId;
    const receiverId = params.userId;

    const friendships = await this.friendshipManager.getFriendship(
      senderId,
      receiverId,
    );
    if (
      !friendships ||
      friendships.friendshipsStatus !== FRIENDSHIP_STATUSES.APPROVED
    ) {
      this.errorService.e('cantDeleteIfUserNotInFriendList', 'en');
    }

    return true;
  }
}
