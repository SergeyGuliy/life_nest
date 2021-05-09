import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

const mapOfUsers = {};

@WebSocketGateway()
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  @SubscribeMessage('giveUserIdToServer')
  giveUserIdToServer(client: Socket, { userId, clientId }) {
    mapOfUsers[clientId] = userId;
    client.join('GLOBAL');
    console.log(this.server.sockets.adapter.rooms);
  }

  public sendMessageToClient(room, messageData): void {
    this.server.to(room).emit('messageToClient', messageData);
  }

  public handleConnection(client: Socket): void {
    client.emit('callUserIdToServer', client.id);
  }

  public handleDisconnect(client: Socket): void {
    delete mapOfUsers[client.id];
    client.leave('GLOBAL');
  }

  public afterInit(client: Server): void {}
}
