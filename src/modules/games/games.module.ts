import { Module } from '@nestjs/common';

import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { RoomsSocketGateway } from './ws/game.gateway';
import { SocketNameSpacerService } from '../../sub_modules/globalServices/socket-namespaser.service';
import { EntityManagerModule } from '../../sub_modules/entitiesManagers/entitiy-manager.module';
import { GlobalServicesModule } from '../../sub_modules/globalServices/global-services.module';

import { MongooseModule } from '@nestjs/mongoose';
import { Game, GamesSchema } from '../../sub_modules/entitiesManagers/games/games.schema';

@Module({
  imports: [
    GlobalServicesModule,
    EntityManagerModule,
    MongooseModule.forFeature([{ name: Game.name, schema: GamesSchema }]),
  ],
  controllers: [GamesController],
  providers: [GamesService, RoomsSocketGateway, SocketNameSpacerService],
  exports: [GamesService],
})
export class GamesModule {}
