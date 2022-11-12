import { HttpStatus } from '@nestjs/common';
import { gamesUser } from '@assets/errors/games/gamesUser';
import { gamesCredits } from '@assets/errors/games/gamesCredits';

export const gameErrors = {
  ...gamesUser,
  ...gamesCredits,

  gamePriceIsNotSame: {
    status: HttpStatus.METHOD_NOT_ALLOWED,
    locales: {
      en: 'Price is not same',
    },
  },
};
