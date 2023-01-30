import { Injectable } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { SocketNameSpacerService } from '../../../modules-helpers/global-services/socket-namespaser.service.js';

@Injectable()
@WebSocketGateway()
export class RoomsSocketGateway {
  constructor(private socketNameSpacerService: SocketNameSpacerService) {}
  @WebSocketServer() server: Server;

  @SubscribeMessage('rooms_userConnectsRoom')
  public userConnectsRoom(client: Socket, { roomId }) {
    client.emit('rooms_userJoinRoom', roomId);
  }
}
