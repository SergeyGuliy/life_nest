import { Module } from '@nestjs/common';

import { SocketWsEmitter } from './ws/socket.ws-emitter.js';
import { SocketWsListener } from './ws/socket.ws-listener.js';
import { SocketService } from './socket.service.js';

import { EntityManagerModule } from '../entities-services/entitiy-manager.module.js';
import { RoomsModule } from '../../modules/rooms/rooms.module.js';
import { GlobalServicesModule } from '../global-services/global-services.module.js';

@Module({
  imports: [GlobalServicesModule, EntityManagerModule, RoomsModule],
  providers: [SocketService, SocketWsEmitter, SocketWsListener],
})
export class SocketModule {}
