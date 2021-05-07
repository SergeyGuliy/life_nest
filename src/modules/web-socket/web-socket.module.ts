import { Module } from '@nestjs/common';
import { WebSocketService } from './web-socket.service';
import { CustomSocketGateway } from './web-socket.gateway';

@Module({
  providers: [WebSocketService, CustomSocketGateway],
})
export class WebSocketModule {}
