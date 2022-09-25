import { Module } from '@nestjs/common';

import { SocketWsEmitter } from './ws/socket.ws-emitter';
import { SocketWsListener } from './ws/socket.ws-listener';
import { SocketService } from './socket.service';

import { EntityManagerModule } from '../entities-services/entitiy-manager.module';
import { RoomsModule } from '../../modules/rooms/rooms.module';
import { GlobalServicesModule } from '../global-services/global-services.module';

@Module({
  imports: [GlobalServicesModule, EntityManagerModule, RoomsModule],
  providers: [SocketService, SocketWsEmitter, SocketWsListener],
})
export class SocketModule {}
