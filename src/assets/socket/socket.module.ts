import { Module } from '@nestjs/common';

import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';

import { SocketNameSpacerService } from '../globalServices/socket-namespaser.service';
import { EntityManagerModule } from '../entitiesManagers/entitiy-manager.module';
import { RoomsModule } from '../../modules/rooms/rooms.module';

@Module({
  imports: [EntityManagerModule, RoomsModule],
  providers: [SocketService, SocketGateway, SocketNameSpacerService],
})
export class SocketModule {}
