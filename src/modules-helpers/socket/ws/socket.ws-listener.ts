import { Inject } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

import { SocketService } from '../socket.service';
import { SocketNameSpacerService } from '../../global-services/socket-namespaser.service';
import {
  socketSetup_callUserIdToServer,
  socketSetup_giveUserIdToServer,
} from '@constants/ws/socketSetup.js';
import { SocketWsEmitter } from './socket.ws-emitter';

@WebSocketGateway()
export class SocketWsListener
  implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private readonly server: Server;
  @Inject(SocketService)
  private readonly socketService: SocketService;
  @Inject(SocketNameSpacerService)
  private readonly socketNameSpacerService: SocketNameSpacerService;
  @Inject(SocketWsEmitter)
  private readonly socketWsEmitter: SocketWsEmitter;

  public handleConnection(client: Socket): void {
    client.emit(socketSetup_callUserIdToServer, client.id);
  }

  public async handleDisconnect(client: Socket) {
    client.leave('GLOBAL');
    const userId = this.socketNameSpacerService.findUserIdBySid(client.id);
    this.socketNameSpacerService.deleteUser(client.id);
    await this.socketService.logOutUserFormAppTimeout(userId);
  }

  @SubscribeMessage(socketSetup_giveUserIdToServer)
  async giveUserIdToServer(client: Socket, { userId, clientId }) {
    client.join('GLOBAL');
    await this.socketService.userLogIn(userId);
    const sidsToDisconnect = this.socketNameSpacerService.addUser(
      clientId,
      userId,
    );
    this.socketWsEmitter.forceDisconnectSidFromServer(sidsToDisconnect);
  }
}
