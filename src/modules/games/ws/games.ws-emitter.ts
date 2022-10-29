import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { Server } from 'socket.io';
import { SocketNameSpacerService } from '@modules-helpers/global-services/socket-namespaser.service';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway()
export class GamesWsEmitter {
  @WebSocketServer()
  private readonly server: Server;
  @Inject(SocketNameSpacerService)
  private readonly socketNameSpacerService: SocketNameSpacerService;

  public startGame(roomId, gameData): void {
    this.server
      .to(this.getRoomName(roomId))
      .emit('games_gameStarted', gameData);
  }

  public gameTick(roomId, tickData): void {
    this.server.to(this.getRoomName(roomId)).emit('games_tick', tickData);
  }

  public async sendUserData(userId, userData) {
    const sid = this.socketNameSpacerService.findSidByUserId(userId);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.server.to(sid).emit('games_sendUserData', userData);
  }

  private getRoomName(roomId: number) {
    return `ROOM-${roomId}`;
  }
}
