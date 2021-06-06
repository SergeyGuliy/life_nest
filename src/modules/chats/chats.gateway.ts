import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatsService } from './chats.service';
import { MessageReceiverTypes } from '../../plugins/database/enums';
import { SocketNamespaserService } from '../socket-namespaser/socket-namespaser.service';

@WebSocketGateway()
export class ChatsGateway {
  constructor(
    private chatService: ChatsService,
    private socketNamespaserService: SocketNamespaserService,
  ) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('messageToServer')
  public async messageToServer(client: Socket, messageToServer): Promise<void> {
    const messageToClient = await this.chatService.saveMessage(messageToServer);
    const {
      messageSender,
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
      const sids = [
        this.socketNamespaserService.findSidByUserId(messageSender.userId),
        this.socketNamespaserService.findSidByUserId(messageReceiverUserId),
      ];
      sids.forEach((sid) => {
        if (sid) {
          this.server.to(sid).emit('messageToClient', messageToClient);
        }
      });
    }
  }

  public sendMessageToClient(room, messageData): void {
    this.server.to(room).emit('messageToClient', messageData);
  }
}
