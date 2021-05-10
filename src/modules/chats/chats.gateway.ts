import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatsService } from './chats.service';
import { MessageReceiverTypes } from '../../plugins/database/enums';

@WebSocketGateway()
export class ChatsGateway {
  constructor(private chatService: ChatsService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('messageToServer')
  public async messageToServer(client: Socket, messageToServer): Promise<void> {
    const messageToClient = await this.chatService.saveMessage(messageToServer);
    const {
      messageReceiverType,
      messageReceiverRoomId,
      messageReceiverUserId,
    } = messageToClient;
    if (messageReceiverType === MessageReceiverTypes.GLOBAL) {
      this.sendMessageToClient(messageReceiverType, messageToClient);
    } else if (messageReceiverType === MessageReceiverTypes.ROOM) {
      this.sendMessageToClient(
        `${messageReceiverType}-${messageReceiverRoomId}`,
        messageToClient,
      );
    } else if (messageReceiverType === MessageReceiverTypes.PRIVATE) {
      this.sendMessageToClient(
        `${messageReceiverType}-${messageReceiverUserId}`,
        messageToClient,
      );
    }
  }

  public sendMessageToClient(room, messageData): void {
    this.server.to(room).emit('messageToClient', messageData);
  }
}
