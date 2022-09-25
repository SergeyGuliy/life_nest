import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Socket, Server } from 'socket.io';
import { SocketNameSpacerService } from '../../../modules-helpers/global-services/socket-namespaser.service';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway()
export class RoomsSocketGateway {
  constructor(private socketNameSpacerService: SocketNameSpacerService) {}
  @WebSocketServer() server: Server;

  @SubscribeMessage('rooms_userConnectsRoom')
  public userConnectsRoom(client: Socket, { roomId }) {
    client.emit('rooms_userJoinRoom', roomId);
  }

  public updateUsersListInRoom(): void {
    this.server.to('ffffff').emit('rooms_updateUsersListInRoom', {});
  }
}
