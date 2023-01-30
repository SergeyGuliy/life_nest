import { HttpStatus } from '@nestjs/common';

import { gamesUser } from './games/gamesUser.js';
import { gamesCredits } from './games/gamesCredits.js';

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
