import {
  CanActivate,
  ExecutionContext,
  mixin,
  Type,
  Inject,
} from '@nestjs/common';

import { ErrorHandlerService } from '@modules-helpers/global-services/error-handler.service';

import { FriendshipManagerService } from '@modules-helpers/entities-services/friendships/friendships.service';
import { FRIENDSHIP_STATUSES } from '../../../../../life_shared/enums';

export const DeclineIfStatusGuard = (type): Type<CanActivate> => {
  class DeclineIfStatusGuardMixin implements CanActivate {
    @Inject(FriendshipManagerService)
    private readonly friendshipManagerService: FriendshipManagerService;
    @Inject(ErrorHandlerService)
    private readonly errorHandlerService: ErrorHandlerService;

    async canActivate(context: ExecutionContext): Promise<any> {
      const { user, params } = context.switchToHttp().getRequest();

      const yourId = user.userId;
      const receiverId = params.userId;

      const friendships = await this.friendshipManagerService.getYourFriendshipConnection(
        yourId,
        receiverId,
      );

      if (!friendships) {
        this.errorHandlerService.error('youDontHaveRequest', 'en', [yourId]);
      }

      if (friendships.friendshipsStatus === FRIENDSHIP_STATUSES.APPROVED) {
        this.errorHandlerService.error('userAlreadyInFriends', 'en');
      }

      if (yourId === +friendships.friendshipReceiver) {
        return true;
      }

      if (type === 'accept') {
        this.errorHandlerService.error('acceptFriendshipCanOnlyReceiver', 'en');
      }
      if (type === 'ignore') {
        this.errorHandlerService.error('ignoreCanOnlyReceiver', 'en');
      }
    }
  }

  return mixin(DeclineIfStatusGuardMixin);
};
