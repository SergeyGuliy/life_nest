import { HttpStatus } from '@nestjs/common';

export const usersDataErrors = {
  gameUserNotEnoughCash: {
    status: HttpStatus.METHOD_NOT_ALLOWED,
    locales: {
      en: 'Not enough cash',
    },
  },
};
