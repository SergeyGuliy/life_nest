import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { MessageReceiverTypes } from '../../plugins/database/entities/enums';

@WebSocketGateway()
export class RoomsSocketGateway {
  @WebSocketServer() server: Server;

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

  @SubscribeMessage('userConnectsRoom')
  public userConnectsRoom(client: Socket, data) {
    client.join(`${MessageReceiverTypes.ROOM}-${data.roomId}`);
    client.emit('joinRoom', data.roomId);
  }

  @SubscribeMessage('subscribeRoomsUpdate')
  public subscribeRoomsUpdate(client: Socket): void {
    client.join('RoomsUpdater');
  }

  @SubscribeMessage('unSubscribeRoomsUpdate')
  public unSubscribeRoomsUpdate(client: Socket): void {
    client.leave('RoomsUpdater');
  }

  public leaveRoom(userId): void {
    this.server.to(userId).emit('leaveRoom');
  }
}
