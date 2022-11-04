import { HttpStatus } from '@nestjs/common';

export const authErrors = {
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

  wrongPasswordOrLogin: {
    status: HttpStatus.BAD_REQUEST,
    locales: {
      en: 'Wrong password or login',
    },
  },
};
