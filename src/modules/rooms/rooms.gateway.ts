import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Socket, Server } from 'socket.io';
import { MESSAGE_RECEIVER_TYPES } from '../../assets/enums';
import { SocketNameSpacerService } from '../../sub_modules/globalServices/socket-namespaser.service';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway()
export class RoomsSocketGateway {
  constructor(
    private socketNameSpacerService: SocketNameSpacerService,
  ) {}
  @WebSocketServer() server: Server;

  @SubscribeMessage('userConnectsRoom')
  public userConnectsRoom(client: Socket, { roomId }) {
    client.join(this.getRoomName(roomId));
    client.emit('userJoinRoom', roomId);
  }

  @SubscribeMessage('subscribeRoomsUpdate')
  public subscribeRoomsUpdate(client: Socket): void {
    client.join('RoomsUpdater');
  }

  @SubscribeMessage('unSubscribeRoomsUpdate')
  public unSubscribeRoomsUpdate(client: Socket): void {
    client.leave('RoomsUpdater');
  }

  @SubscribeMessage('kickUserFromRoom')
  public kickUserFromRoom(client: Socket, { userId }): void {
    console.log('kickUserFromRoom');
    console.log(userId);
  }

  @SubscribeMessage('setNewAdminInRoom')
  public setNewAdminInRoom(client: Socket, { userId }): void {
    console.log('setNewAdminInRoom');
    console.log(userId);
  }

  public updateUsersListInRoom(roomId, usersInRoom): void {
    this.server
      .to(this.getRoomName(roomId))
      .emit('updateUsersListInRoom', usersInRoom);
  }

  public updateRoomAdmin(roomId, newAdmin): void {
    this.server.to(this.getRoomName(roomId)).emit('updateRoomAdmin', newAdmin);
  }

  public async userLeaveRoom(userId) {
    const sid = await this.socketNameSpacerService.findSidByUserId(userId);
    if (typeof sid === 'string') {
      this.server.to(sid).emit('userLeaveRoom');
    }
  }

  public roomInListCreated(roomData): void {
    this.server.to('RoomsUpdater').emit('roomInListCreated', roomData);
  }

  public roomInListDeleted(roomId): void {
    this.server.to('RoomsUpdater').emit('roomInListDeleted', roomId);
  }

  public roomInListUpdated(roomId, roomData): void {
    this.server.to('RoomsUpdater').emit('roomInListUpdated', {
      roomId,
      roomData,
    });
  }

  private getRoomName(roomId: number) {
    return `${MESSAGE_RECEIVER_TYPES.ROOM}-${roomId}`;
  }
}
