import { HttpStatus } from '@nestjs/common';
import { usersDataErrors } from '@assets/errors/games/usersDataErrors';

export const gameErrors = {
  ...usersDataErrors,

  gamePriceIsNotSame: {
    status: HttpStatus.METHOD_NOT_ALLOWED,
    locales: {
      en: 'Price is not same',
    },
  },
};