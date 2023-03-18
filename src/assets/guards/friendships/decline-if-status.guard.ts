import {
  CanActivate,
  ExecutionContext,
  mixin,
  Type,
  Inject,
} from '@nestjs/common';

import { ErrorService } from '@modules-helpers/global-services/error-handler.service';

import { FriendshipManager } from '@modules-helpers/entities-services/friendships/friendships.service';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { FRIENDSHIP_STATUSES } from '@enums/index.js';

export const DeclineIfStatusGuard = (type): Type<CanActivate> => {
  class DeclineIfStatusGuardMixin implements CanActivate {
    @Inject(FriendshipManager)
    private readonly friendshipManager: FriendshipManager;
    @Inject(ErrorService)
    private readonly errorService: ErrorService;

    async canActivate(context: ExecutionContext): Promise<any> {
      const { user, params } = context.switchToHttp().getRequest();

      const yourId = user.userId;
      const receiverId = params.userId;

      const friendships = await this.friendshipManager.getYourFriendships(
        yourId,
        receiverId,
      );

      if (!friendships) {
        this.errorService.e('youDontHaveRequest', 'en', [yourId]);
      }

      if (friendships.friendshipsStatus === FRIENDSHIP_STATUSES.APPROVED) {
        this.errorService.e('userAlreadyInFriends', 'en');
      }

      if (yourId === +friendships.friendshipReceiver) {
        return true;
      }

      if (type === 'accept') {
        this.errorService.e('acceptFriendshipCanOnlyReceiver', 'en');
      }
      if (type === 'ignore') {
        this.errorService.e('ignoreCanOnlyReceiver', 'en');
      }
    }
  }

  return mixin(DeclineIfStatusGuardMixin);
};
