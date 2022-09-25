import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

import { socketSetup_forceDisconnect } from '@constants/ws/socketSetup.js';

@WebSocketGateway()
export class SocketWsEmitter {
  @WebSocketServer() server: Server;

  public forceDisconnectSidFromServer(sidsToDisconnect: string[]) {
    if (!sidsToDisconnect.length) return;

    sidsToDisconnect.forEach((sid) => {
      this.server.to(sid).emit(socketSetup_forceDisconnect);
      this.server.to(sid).disconnectSockets(true);
    });
  }
}
