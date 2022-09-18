import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

import {
  rooms_userConnectsRoom,
  rooms_subscribeRoomsUpdate,
  rooms_unSubscribeRoomsUpdate,
  rooms_kickUserFromRoom,
  rooms_setNewAdminInRoom,
  rooms_userJoinRoom,
  rooms_RoomsUpdater,
} from '@constants/ws/rooms.js';

import { RoomsWsEmitter } from './rooms.ws-emitter';

@Injectable()
@WebSocketGateway()
export class RoomsWsListener {
  constructor(private roomsWsEmitter: RoomsWsEmitter) {}

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

  private getRoomName(roomId: number) {
    return `ROOM-${roomId}`;
  }
}
