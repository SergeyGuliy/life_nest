import { gameErrors } from '@assets/errors/games';
import { authErrors } from '@assets/errors/auth';
import { friendshipsErrors } from '@assets/errors/friendships';
import { roomsErrors } from '@assets/errors/rooms';
import { usersErrors } from '@assets/errors/users';

export const errors = {
  ...authErrors,
  ...usersErrors,

  ...friendshipsErrors,

  ...roomsErrors,
  ...gameErrors,
};
