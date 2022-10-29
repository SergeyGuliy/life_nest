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

  public updateRoomAdmin(roomId, newAdmin): void {
    this.server
      .to(this.getRoomName(roomId))
      .emit(rooms_updateRoomAdmin, newAdmin);
  }

  public userLeaveRoom(roomId, userId) {
    const sid = this.socketNameSpacerService.findSidByUserId(userId);
    if (typeof sid === 'string') {
      this.server.to(sid).emit(rooms_userLeaveRoom);
      this.server
        .to(this.getRoomName(roomId))
        .emit(rooms_userKickedFromRoom, userId);
    }
  }

  public async updateToggleLockRoom(roomId, lockState) {
    this.server
      .to(this.getRoomName(roomId))
      .emit(rooms_updateToggleLockRoom, lockState);
  }

  public roomInListCreated(roomData): void {
    this.server.to(rooms_RoomsUpdater).emit(rooms_roomInListCreated, roomData);
  }

  public roomInListDeleted(roomId): void {
    this.server.to(rooms_RoomsUpdater).emit(rooms_roomInListDeleted, roomId);
  }

  public roomInListUpdated(roomId, roomData): void {
    this.server
      .to(rooms_RoomsUpdater)
      .emit(rooms_roomInListUpdated, { roomId, roomData });
  }

  private getRoomName(roomId: number) {
    return `ROOM-${roomId}`;
  }
}
