import { Module } from '@nestjs/common';

import { RoomsController } from './rooms.controller.js';
import { RoomsService } from './rooms.service.js';
import { RoomsWsListener } from './ws/rooms.ws-listener.js';
import { RoomsWsEmitter } from './ws/rooms.ws-emitter.js';
import { SocketNameSpacerService } from '../../modules-helpers/global-services/socket-namespaser.service.js';
import { EntityManagerModule } from '../../modules-helpers/entities-services/entitiy-manager.module.js';
import { GlobalServicesModule } from '../../modules-helpers/global-services/global-services.module.js';
import { GamesModule } from '../games/games.module.js';

@Module({
  imports: [GlobalServicesModule, EntityManagerModule, GamesModule],
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
