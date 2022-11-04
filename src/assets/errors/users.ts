import { HttpStatus } from '@nestjs/common';

export const usersErrors = {
  userNotFound: {
    status: HttpStatus.NOT_FOUND,
    locales: {
      en: 'User not found',
    },
  },
};
