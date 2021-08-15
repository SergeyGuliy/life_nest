import { HttpStatus } from '@nestjs/common';

export const errors = {
  invalidRefreshToken: {
    status: HttpStatus.BAD_REQUEST,
    locales: {
      en: 'Invalid refreshToken',
    },
  },
  emailAlreadyInUse: {
    status: HttpStatus.BAD_REQUEST,
    locales: {
      en: 'Email already in use',
    },
  },
  phoneAlreadyInUse: {
    status: HttpStatus.BAD_REQUEST,
    locales: {
      en: 'Phone already in use',
    },
  },
  phoneAndEmailAlreadyInUse: {
    status: HttpStatus.BAD_REQUEST,
    locales: {
      en: 'Email and phone already in use',
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
      en: 'Ignore friendship connection can only receiver',
    },
  },
  cantSendRequestToYourself: {
    status: HttpStatus.NOT_FOUND,
    locales: {
      en: "You can't sent friendship request to yourself",
    },
  },
  acceptFriendshipCanOnlyReceiver: {
    status: HttpStatus.METHOD_NOT_ALLOWED,
    locales: {
      en: 'Accept friendship connection can only receiver',
    },
  },
  userAlreadyInFriends: {
    status: HttpStatus.METHOD_NOT_ALLOWED,
    locales: {
      en: 'User is already in your friends list',
    },
  },
  roomAlreadyFull: {
    status: HttpStatus.BAD_REQUEST,
    locales: {
      en: 'Room already full',
    },
  },
  wrongRoomPassword: {
    status: HttpStatus.BAD_REQUEST,
    locales: {
      en: 'Wrong room password',
    },
  },
  wrongPasswordOrLogin: {
    status: HttpStatus.BAD_REQUEST,
    locales: {
      en: 'Wrong password or login',
    },
  },
  userNotFound: {
    status: HttpStatus.NOT_FOUND,
    locales: {
      en: 'User not found',
    },
  },
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
};
