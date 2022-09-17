import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { debounce } from 'throttle-debounce';

import { LOGOUT_TIMEOUT } from '@constants/index.js';

import { SocketService } from './socket.service';
import { SocketNameSpacerService } from '../globalServices/socket-namespaser.service';
import {
  socketSetup_giveUserIdToServer,
  socketSetup_callUserIdToServer,
  socketSetup_forceDisconnect,
} from '@constants/ws/socketSetup.js';
@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private socketService: SocketService,
    private socketNameSpacerService: SocketNameSpacerService,
  ) {}
  @WebSocketServer() server: Server;

  @SubscribeMessage(socketSetup_giveUserIdToServer)
  async giveUserIdToServer(client: Socket, { userId, clientId }) {
    client.join('GLOBAL');
    await this.socketService.userLogIn(userId);
    const sidsToDisconnect = this.socketNameSpacerService.addUser(
      clientId,
      userId,
    );
    this.forceDisconnectSidFromServer(sidsToDisconnect);
  }

  public handleConnection(client: Socket): void {
    client.emit(socketSetup_callUserIdToServer, client.id);
  }

  public async handleDisconnect(client: Socket) {
    client.leave('GLOBAL');
    const userId = this.socketNameSpacerService.findUserIdBySid(client.id);
    this.socketNameSpacerService.deleteUser(client.id);
    await this.logOutUserFormApp(userId);
  }

  forceDisconnectSidFromServer(sidsToDisconnect: string[]) {
    if (sidsToDisconnect.length) {
      sidsToDisconnect.forEach((sid) => {
        this.server.to(sid).emit(socketSetup_forceDisconnect);
        this.server.to(sid).disconnectSockets(true);
      });
    }
  }

  private logOutUserFormApp = debounce(LOGOUT_TIMEOUT, async (userId) => {
    await this.socketService.logOutUserFormApp(userId);
  });
}
