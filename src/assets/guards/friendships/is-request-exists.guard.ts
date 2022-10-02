import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

import { ErrorHandlerService } from '@modules-helpers/global-services/error-handler.service';

import { FriendshipManagerService } from '@modules-helpers/entities-services/friendships/friendships.service';

@Injectable()
export class IsRequestExistsGuard implements CanActivate {
  constructor(
    private readonly friendshipManagerService: FriendshipManagerService,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const { user, params } = context.switchToHttp().getRequest();

    const senderId = user.userId;
    const receiverId = params.userId;
    const friendships = await this.friendshipManagerService.getBothFriendshipConnection(
      senderId,
      receiverId,
    );
    if (friendships) {
      this.errorHandlerService.error('friendshipsInStatus', 'en', [
        friendships.friendshipsStatus,
      ]);
    }

    return true;
  }
}
