import { Module } from '@nestjs/common';
import { SocketGateway } from './web-socket.gateway';

@Module({
  providers: [SocketGateway],
})
export class WebSocketModule {}
