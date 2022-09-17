import { Module } from '@nestjs/common';

import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { RoomsWsListener } from './rooms.ws-listener';
import { RoomsWsEmitter } from './rooms.ws-emmiter';
import { SocketNameSpacerService } from '../../sub_modules/globalServices/socket-namespaser.service';
import { EntityManagerModule } from '../../sub_modules/entitiesManagers/entitiy-manager.module';
import { GlobalServicesModule } from '../../sub_modules/globalServices/global-services.module';

import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from './game.schema';

@Module({
  imports: [
    GlobalServicesModule,
    EntityManagerModule,
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
  ],
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
