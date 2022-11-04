import { HttpStatus } from '@nestjs/common';

export const friendshipsErrors = {
  friendshipsInStatus: {
    status: HttpStatus.METHOD_NOT_ALLOWED,
    locales: {
      en: 'Friendship connection is in status: {0}',
    },
  },
  youDontHaveRequest: {
    status: HttpStatus.METHOD_NOT_ALLOWED,
    locales: {
      en: "You don't have request from user with ID: {0}",
    },
  },
  friendshipReceiverNotFound: {
    status: HttpStatus.NOT_FOUND,
    locales: {
      en: 'Friendship receiver with userId {0} not found',
    },
  },

  cantDeleteIfUserNotInFriendList: {
    status: HttpStatus.METHOD_NOT_ALLOWED,
    locales: {
      en: "You can't delete user if he is not in your friends list",
    },
  },
  ignoreCanOnlyReceiver: {
    status: HttpStatus.METHOD_NOT_ALLOWED,
    locales: {
      en: 'Ignore friendships connection can only receiver',
    },
  },
  cantSendRequestToYourself: {
    status: HttpStatus.NOT_FOUND,
    locales: {
      en: "You can't sent friendships request to yourself",
    },
  },
  acceptFriendshipCanOnlyReceiver: {
    status: HttpStatus.METHOD_NOT_ALLOWED,
    locales: {
      en: 'Accept friendships connection can only receiver',
    },
  },
  userAlreadyInFriends: {
    status: HttpStatus.METHOD_NOT_ALLOWED,
    locales: {
      en: 'User is already in your friends list',
    },
  },
};
