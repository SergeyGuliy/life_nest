import { Module } from '@nestjs/common';

import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';

import { EntityManagerModule } from '../entitiesManagers/entitiy-manager.module';
import { RoomsModule } from '../../modules/rooms/rooms.module';
import { GlobalServicesModule } from '../globalServices/global-services.module';

@Module({
  imports: [GlobalServicesModule, EntityManagerModule, RoomsModule],
  providers: [SocketService, SocketGateway],
})
export class SocketModule {}
