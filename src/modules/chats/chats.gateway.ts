import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatsService } from './chats.service';
import { MessageReceiverTypes } from '../assets/database/enums';
import { SocketNameSpacerService } from '../assets/socket/socket-namespaser.service';

@WebSocketGateway()
export class ChatsGateway {
  constructor(
    private chatService: ChatsService,
    private socketNameSpacerService: SocketNameSpacerService,
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
        this.socketNameSpacerService.findSidByUserId(messageSender.userId),
        this.socketNameSpacerService.findSidByUserId(messageReceiverUserId),
      ];
      sids.forEach((sid) => {
        if (typeof sid === 'string') {
          this.server.to(sid).emit('messageToClient', messageToClient);
        }
      });
    }
  }

  public sendMessageToClient(room, messageData): void {
    this.server.to(room).emit('messageToClient', messageData);
  }
}
