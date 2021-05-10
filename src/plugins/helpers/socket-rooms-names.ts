import { MessageReceiverTypes } from '../database/entities/enums';

export function getRoomName(roomId: number) {
  return `${MessageReceiverTypes.ROOM}-${roomId}`;
}
