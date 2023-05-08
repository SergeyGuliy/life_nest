import { HttpStatus } from '@nestjs/common';

export const roomsErrors = {
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
  isNotRoomAdmin: {
    status: HttpStatus.BAD_REQUEST,
    locales: {
      en: 'You are not room admin',
    },
  },
  roomIsBLocked: {
    status: HttpStatus.BAD_REQUEST,
    locales: {
      en: 'Room is blocked',
    },
  },
  roomNotExist: {
    status: HttpStatus.BAD_REQUEST,
    locales: {
      en: 'Room not exist',
    },
  },
};
