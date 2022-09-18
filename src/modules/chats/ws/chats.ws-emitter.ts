import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

import { chat_messageToClient } from '@constants/ws/chats';

@WebSocketGateway()
export class ChatsWsEmitter {
  @WebSocketServer() server: Server;

  public sendMessageToClient(target, messageData): void {
    this.server.to(target).emit(chat_messageToClient, messageData);
  }
}
