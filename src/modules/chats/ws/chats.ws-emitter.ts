import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

import { chat_messageToClient } from 'life_shared/constants/ws/chats.js';

@WebSocketGateway()
export class ChatsWsEmitter {
  @WebSocketServer()
  private readonly server: Server;

  public sendMessageToClient(target, messageData): void {
    this.server.to(target).emit(chat_messageToClient, messageData);
  }
}
