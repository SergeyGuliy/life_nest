import { gameErrors } from './games.js';
import { authErrors } from './auth.js';
import { friendshipsErrors } from './friendships.js';
import { roomsErrors } from './rooms.js';
import { usersErrors } from './users.js';

export const errors = {
  ...authErrors,
  ...usersErrors,

  ...friendshipsErrors,

  ...roomsErrors,
  ...gameErrors,
};
