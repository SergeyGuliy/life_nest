import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { addUser, deleteUser } from '../../plugins/helpers/socket-transformer';

const mapOfUsers = {};

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  @SubscribeMessage('giveUserIdToServer')
  giveUserIdToServer(client: Socket, { userId, clientId }) {
    addUser(clientId, userId);
    client.join('GLOBAL');
  }

  public sendMessageToClient(room, messageData): void {
    this.server.to(room).emit('messageToClient', messageData);
  }

  public handleConnection(client: Socket): void {
    client.emit('callUserIdToServer', client.id);
  }

  public handleDisconnect(client: Socket): void {
    deleteUser(client.id);
    client.leave('GLOBAL');
  }
}
