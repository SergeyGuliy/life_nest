import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { Server } from 'socket.io';
import { SocketNameSpacerService } from '@modules-helpers/global-services/socket-namespaser.service';
import { Inject, Injectable } from '@nestjs/common';
import {
  rooms_updateUsersListInRoom,
  rooms_updateRoomAdmin,
  rooms_userLeaveRoom,
  rooms_userKickedFromRoom,
  rooms_updateToggleLockRoom,
  rooms_roomInListCreated,
  rooms_roomInListDeleted,
  rooms_roomInListUpdated,
  rooms_RoomsUpdater,
} from '@constants/ws/rooms.js';

@Injectable()
@WebSocketGateway()
export class RoomsWsEmitter {
  @WebSocketServer()
  private readonly server: Server;
  @Inject(SocketNameSpacerService)
  private readonly socketNameSpacerService: SocketNameSpacerService;

  public updateUsersListInRoom(roomId, usersInRoom): void {
    this.server
      .to(this.getRoomName(roomId))
      .emit(rooms_updateUsersListInRoom, usersInRoom);
  }

  private getRoomName(roomId: number) {
    return `ROOM-${roomId}`;
  }
}
