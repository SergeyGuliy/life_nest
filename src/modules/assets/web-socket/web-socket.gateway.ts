import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

import { debounce } from 'throttle-debounce';
import { WebSocketService } from './web-socket.service';
const DEBOUNCE_TIMEOUT = 10000;

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private webSocketService: WebSocketService) {}
  @WebSocketServer() server: Server;

  @SubscribeMessage('giveUserIdToServer')
  async giveUserIdToServer(client: Socket, { userId, clientId }) {
    client.join('GLOBAL');
    await this.webSocketService.logInUserIntoApp(userId, clientId);
  }

  public handleConnection(client: Socket): void {
    client.emit('callUserIdToServer', client.id);
  }

  public handleDisconnect(client: Socket): void {
    client.leave('GLOBAL');
    this.logOutUserFormApp(client.id);
  }

  private logOutUserFormApp = debounce(DEBOUNCE_TIMEOUT, async (clientId) => {
    await this.webSocketService.logOutUserFormApp(clientId);
  });
}
