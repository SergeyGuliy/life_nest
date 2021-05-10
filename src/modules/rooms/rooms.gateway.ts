import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { findSidByUserId } from '../../plugins/helpers/socket-transformer';
import { getRoomName } from '../../plugins/helpers/socket-rooms-names';

@WebSocketGateway()
export class RoomsSocketGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('userConnectsRoom')
  public userConnectsRoom(client: Socket, { roomId }) {
    client.join(getRoomName(roomId));
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

  public updateUsersListInRoom(roomId, usersInRoom): void {
    this.server
      .to(getRoomName(roomId))
      .emit('updateUsersListInRoom', usersInRoom);
  }

  public updateRoomAdmin(roomId, newAdmin): void {
    this.server.to(getRoomName(roomId)).emit('updateRoomAdmin', newAdmin);
  }

  public userLeaveRoom(userId): void {
    const sid = findSidByUserId(userId);
    this.server.to(sid).emit('userLeaveRoom');
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
}
