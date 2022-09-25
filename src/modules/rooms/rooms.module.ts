import { Module } from '@nestjs/common';

import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { RoomsWsListener } from './ws/rooms.ws-listener';
import { RoomsWsEmitter } from './ws/rooms.ws-emitter';
import { SocketNameSpacerService } from '@modules-helpers/global-services/socket-namespaser.service';
import { EntityManagerModule } from '@modules-helpers/entities-services/entitiy-manager.module';
import { GlobalServicesModule } from '@modules-helpers/global-services/global-services.module';

@Module({
  imports: [GlobalServicesModule, EntityManagerModule],
  controllers: [RoomsController],
  providers: [
    RoomsService,
    RoomsWsEmitter,
    RoomsWsListener,
    SocketNameSpacerService,
  ],
  exports: [RoomsService],
})
export class RoomsModule {}
