import { HttpStatus } from '@nestjs/common';

export const usersDataErrors = {
  gameUserNotEnoughCash: {
    status: HttpStatus.METHOD_NOT_ALLOWED,
    locales: {
      en: 'Not enough cash',
    },
  },
  gameUserNotCrypto: {
    status: HttpStatus.METHOD_NOT_ALLOWED,
    locales: {
      en: 'Not enough crypto',
    },
  },
  gameUserNotExistWork: {
    status: HttpStatus.METHOD_NOT_ALLOWED,
    locales: {
      en: 'Not exist work',
    },
  },
};
