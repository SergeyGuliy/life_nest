import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

import { debounce } from 'throttle-debounce';
import { SocketService } from './socket.service';
import { SocketNameSpacerService } from './socket-namespaser.service';
const DEBOUNCE_TIMEOUT = 5000;

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private webSocketService: SocketService,
    private socketNameSpacerService: SocketNameSpacerService,
  ) {}
  @WebSocketServer() server: Server;

  @SubscribeMessage('giveUserIdToServer')
  async giveUserIdToServer(client: Socket, { userId, clientId }) {
    client.join('GLOBAL');
    await this.webSocketService.logInUserIntoApp(userId, clientId);
  }

  public handleConnection(client: Socket): void {
    client.emit('callUserIdToServer', client.id);
  }

  public async handleDisconnect(client: Socket) {
    client.leave('GLOBAL');
    const userId = this.socketNameSpacerService.findUserIdBySid(client.id);
    this.socketNameSpacerService.deleteUser(client.id);
    await this.logOutUserFormApp(userId);
  }

  private logOutUserFormApp = debounce(DEBOUNCE_TIMEOUT, async (userId) => {
    try {
    } catch (e) {}
    await this.webSocketService.logOutUserFormApp(userId);
  });
}
