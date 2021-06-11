import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { MessageReceiverTypes } from '../assets/database/enums';
import { SocketService } from '../assets/socket/socket.service';
import { SocketNameSpacerService } from '../assets/socket/socket-namespaser.service';

@WebSocketGateway()
export class RoomsSocketGateway {
  constructor(
    private webSocket: SocketService,
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
    return `${MessageReceiverTypes.ROOM}-${roomId}`;
  }
}
