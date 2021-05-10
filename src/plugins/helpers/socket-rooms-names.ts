import { MessageReceiverTypes } from '../database/enums';

export function getRoomName(roomId: number) {
  return `${MessageReceiverTypes.ROOM}-${roomId}`;
}
