import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Socket, Server } from 'socket.io';
import { SocketNameSpacerService } from '../../sub_modules/globalServices/socket-namespaser.service';
import { Injectable } from '@nestjs/common';
import {
  rooms_userConnectsRoom,
  rooms_subscribeRoomsUpdate,
  rooms_unSubscribeRoomsUpdate,
  rooms_kickUserFromRoom,
  rooms_setNewAdminInRoom,
  rooms_updateUsersListInRoom,
  rooms_updateRoomAdmin,
  rooms_userLeaveRoom,
  rooms_userKickedFromRoom,
  rooms_updateToggleLockRoom,
  rooms_roomInListCreated,
  rooms_roomInListDeleted,
  rooms_roomInListUpdated,
  rooms_userJoinRoom,
  rooms_RoomsUpdater,
} from '@constants/ws/rooms.js';

@Injectable()
@WebSocketGateway()
export class RoomsSocketGateway {
  constructor(private socketNameSpacerService: SocketNameSpacerService) {}
  @WebSocketServer() server: Server;

  @SubscribeMessage(rooms_userConnectsRoom)
  public userConnectsRoom(client: Socket, { roomId }) {
    client.join(this.getRoomName(roomId));
    client.emit(rooms_userJoinRoom, roomId);
  }

  @SubscribeMessage(rooms_subscribeRoomsUpdate)
  public subscribeRoomsUpdate(client: Socket): void {
    client.join(rooms_RoomsUpdater);
  }

  @SubscribeMessage(rooms_unSubscribeRoomsUpdate)
  public unSubscribeRoomsUpdate(client: Socket): void {
    client.leave(rooms_RoomsUpdater);
  }

  @SubscribeMessage(rooms_kickUserFromRoom)
  public kickUserFromRoom(client: Socket, { userId }): void {
    console.log(userId);
  }

  @SubscribeMessage(rooms_setNewAdminInRoom)
  public setNewAdminInRoom(client: Socket, { userId }): void {
    console.log(rooms_setNewAdminInRoom);
    console.log(userId);
  }

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

  public async userLeaveRoom(roomId, userId) {
    const sid = await this.socketNameSpacerService.findSidByUserId(userId);
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
