import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';

import { ErrorService } from '../../../modules-helpers/global-services/error-handler.service.js';
import { FriendshipManager } from '../../../modules-helpers/entities-services/friendships/friendships.service.js';

@Injectable()
export class IsRequestExistsGuard implements CanActivate {
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
    if (friendships) {
      this.errorService.e('friendshipsInStatus', 'en', [
        friendships.friendshipsStatus,
      ]);
    }

    return true;
  }
}
