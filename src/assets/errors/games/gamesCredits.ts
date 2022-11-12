import { HttpStatus } from '@nestjs/common';

export const gamesCredits = {
  gamesCreditsPercentNotSame: {
    status: HttpStatus.METHOD_NOT_ALLOWED,
    locales: {
      en: 'Percent not same',
    },
  },
};
