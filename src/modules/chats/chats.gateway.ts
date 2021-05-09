import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatsService } from './chats.service';
import { MessageReceiverTypes } from '../../plugins/database/entities/enums';

const mapOfUsers = {};

@WebSocketGateway()
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private chatService: ChatsService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('msgToServer')
  public handleMessage(client: Socket, payload: any) {
    // console.log(payload);
    // client.emit('joinedRoom', payload);
  }

  @SubscribeMessage('joinRoom')
  public joinRoom(client: Socket, room: string): void {
    // console.log(room);
    // client.join(room);
    // client.emit('joinedRoom', room);
  }

  @SubscribeMessage('leaveRoom')
  public leaveRoom(client: Socket, room: string): void {
    // client.leave(room);
    // client.emit('leftRoom', room);
  }

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

  public handleConnection(client: Socket): void {}

  public handleDisconnect(client: Socket): void {}

  public afterInit(client: Server): void {}
}
