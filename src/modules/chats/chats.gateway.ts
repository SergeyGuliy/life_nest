import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

import { ChatsService } from './chats.service';
import { MESSAGE_RECEIVER_TYPES } from '../../assets/enums';
import { SocketNameSpacerService } from '../../sub_modules/globalServices/socket-namespaser.service';
import {
  chat_messageToServer,
  chat_messageToClient,
} from '@constants/ws/chats.js';

@WebSocketGateway()
export class ChatsGateway {
  constructor(
    private chatService: ChatsService,
    private socketNameSpacerService: SocketNameSpacerService,
  ) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage(chat_messageToServer)
  public async messageToServer(client: Socket, messageToServer): Promise<void> {
    const messageToClient = await this.chatService.saveMessage(messageToServer);
    const {
      messageSender,
      messageReceiverType,
      messageReceiverRoomId,
      messageReceiverUserId,
    } = messageToClient;
    if (messageReceiverType === MESSAGE_RECEIVER_TYPES.GLOBAL) {
      this.sendMessageToClient(messageReceiverType, messageToClient);
    } else if (messageReceiverType === MESSAGE_RECEIVER_TYPES.ROOM) {
      this.sendMessageToClient(
        `${messageReceiverType}-${messageReceiverRoomId}`,
        messageToClient,
      );
    } else if (messageReceiverType === MESSAGE_RECEIVER_TYPES.PRIVATE) {
      const sids = [
        this.socketNameSpacerService.findSidByUserId(messageSender.userId),
        this.socketNameSpacerService.findSidByUserId(messageReceiverUserId),
      ];
      sids.forEach((sid) => {
        if (typeof sid === 'string') {
          this.server.to(sid).emit(chat_messageToClient, messageToClient);
        }
      });
    }
  }

  public sendMessageToClient(room, messageData): void {
    this.server.to(room).emit('messageToClient', messageData);
  }
}
