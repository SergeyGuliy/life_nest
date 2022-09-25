import { Module } from '@nestjs/common';

import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { RoomsSocketGateway } from './ws/game.gateway';
import { SocketNameSpacerService } from '@modules-helpers/global-services/socket-namespaser.service';
import { EntityManagerModule } from '@modules-helpers/entities-services/entitiy-manager.module';
import { GlobalServicesModule } from '@modules-helpers/global-services/global-services.module';

import { MongooseModule } from '@nestjs/mongoose';
import {
  Game,
  GamesEntity,
} from '@modules-helpers/entities-services/games/games.entity';

@Module({
  imports: [
    GlobalServicesModule,
    EntityManagerModule,
    MongooseModule.forFeature([{ name: Game.name, schema: GamesEntity }]),
  ],
  controllers: [GamesController],
  providers: [GamesService, RoomsSocketGateway, SocketNameSpacerService],
  exports: [GamesService],
})
export class GamesModule {}
