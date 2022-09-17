import { Module } from '@nestjs/common';

import { GameController } from './game.controller';
import { GameService } from './game.service';
import { RoomsSocketGateway } from './ws/game.gateway';
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
  controllers: [GameController],
  providers: [GameService, RoomsSocketGateway, SocketNameSpacerService],
  exports: [GameService],
})
export class GameModule {}
