import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

declare let life_shared: any;

import { socketSetup_forceDisconnect } from 'life_shared/constants/ws/socketSetup.js';

@WebSocketGateway()
export class SocketWsEmitter {
  @WebSocketServer()
  private readonly server: Server;

  public forceDisconnectSidFromServer(sidsToDisconnect: string[]) {
    if (!sidsToDisconnect.length) return;

    sidsToDisconnect.forEach((sid) => {
      this.server.to(sid).emit(socketSetup_forceDisconnect);
      // this.server.to(sid).disconnectSockets(true);
    });
  }
}
