import { HttpStatus } from '@nestjs/common';

export const gameErrors = {
  gameNotEnoughCash: {
    status: HttpStatus.METHOD_NOT_ALLOWED,
    locales: {
      en: 'Not enough cash',
    },
  },
  gamePriceDifferent: {
    status: HttpStatus.METHOD_NOT_ALLOWED,
    locales: {
      en: 'Not enough cash',
    },
  },
};
