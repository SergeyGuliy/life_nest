import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Inject } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

import { ChatsService } from '../chats.service';
import { SocketNameSpacerService } from '@modules-helpers/global-services/socket-namespaser.service';

import { MESSAGE_RECEIVER_TYPES } from '@enums/index.js';
import { chat_messageToServer } from '@constants/ws/chats.js';
import { ChatsWsEmitter } from './chats.ws-emitter';

@WebSocketGateway()
export class ChatsWsListener {
  @Inject(ChatsService)
  private readonly chatService: ChatsService;
  @Inject(SocketNameSpacerService)
  private readonly socketNameSpacerService: SocketNameSpacerService;
  @Inject(ChatsWsEmitter)
  private readonly chatsWsEmitter: ChatsWsEmitter;

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
      this.chatsWsEmitter.sendMessageToClient(
        messageReceiverType,
        messageToClient,
      );
    } else if (messageReceiverType === MESSAGE_RECEIVER_TYPES.ROOM) {
      this.chatsWsEmitter.sendMessageToClient(
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
          this.chatsWsEmitter.sendMessageToClient(sid, messageToClient);
        }
      });
    }
  }
}
