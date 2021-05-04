import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
// import { Server } from 'ws';

@WebSocketGateway()
export class CustomSocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  @WebSocketServer() socket: Socket;
  private logger: Logger = new Logger('MessageGateway');

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
  public messageToServer(client: Socket, payload): void {
    console.log(payload);
    this.sendMessageToClient(payload.target, payload.messageData);
    // client.leave(room);
    // client.emit('leftRoom', room);
  }

  public handleConnection(client: Socket): void {
    client.emit('connected', client.id);
    // this.eventEmitter();
    client.join('global');
    this.logger.warn(`Client connected: ${client.id}`);
  }

  public handleDisconnect(client: Socket): void {
    client.leave('global');
    this.logger.warn(`Client disconnected: ${client.id}`);
  }

  public afterInit(server: Server): void {
    this.logger.warn('Init websocket connection.');
  }

  public sendMessageToClient(room, messageData): void {
    // this.socket.to('roomList').emit('connected', data);
    // this.socket.client[data].emit('connected', data);
    // console.log(this.server.sockets.adapter.rooms);
    this.server.to(room).emit('messageToClient', messageData);
  }
}
