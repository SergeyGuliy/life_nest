import { Module } from '@nestjs/common';

import { GamesController } from './games.controller.js';
import { GamesService } from './games.service.js';
import { RoomsSocketGateway } from './ws/game.gateway.js';
import { SocketNameSpacerService } from '../../modules-helpers/global-services/socket-namespaser.service.js';
import { EntityManagerModule } from '../../modules-helpers/entities-services/entitiy-manager.module.js';
import { GlobalServicesModule } from '../../modules-helpers/global-services/global-services.module.js';

import { MongooseModule } from '@nestjs/mongoose';
import {
  Game,
  GamesEntity,
} from '../../modules-helpers/entities-services/games/games.entity.js';
import {
  GamesSettings,
  GamesSettingsEntity,
} from '../../modules-helpers/entities-services/games/games-settings.entity.js';
import { GamesWsEmitter } from '../../modules/games/ws/games.ws-emitter.js';
import { GamesTime } from '../../modules/games/games-modules/games-time.js';
import { GamesHistory } from '../../modules/games/games-modules/games-history.js';
import { GamesUsers } from '../../modules/games/games-modules/games-users.js';
import { GamesTickerService } from '../../modules/games/games-ticker.service.js';
import { GamesShares } from '../../modules/games/games-modules/games-shares.js';
import { GamesCryptos } from '../../modules/games/games-modules/games-cryptos.js';
import { GamesWork } from '../../modules/games/games-modules/games-work.js';
import { GamesModifiers } from '../../modules/games/games-modules/games-modificators.js';
import { GamesDeposits } from '../../modules/games/games-modules/games-deposits.js';
import { GamesCredits } from '../../modules/games/games-modules/games-credits.js';
import { GamesTaxes } from '../../modules/games/games-modules/games-taxes.js';
import { GamesExpenses } from '../../modules/games/games-modules/games-expenses.js';
import { GamesNews } from '../../modules/games/games-modules/games-news.js';

@Module({
  imports: [
    GlobalServicesModule,
    EntityManagerModule,
    MongooseModule.forFeature([
      { name: Game.name, schema: GamesEntity },
      { name: GamesSettings.name, schema: GamesSettingsEntity },
    ]),
  ],
  controllers: [GamesController],
  providers: [
    GamesService,
    GamesTime,
    GamesHistory,
    GamesShares,
    GamesCryptos,
    GamesWork,
    GamesUsers,
    GamesTickerService,
    RoomsSocketGateway,
    SocketNameSpacerService,
    GamesWsEmitter,
    GamesModifiers,
    GamesDeposits,
    GamesCredits,
    GamesTaxes,
    GamesExpenses,
    GamesNews,
  ],
  exports: [
    GamesService,
    GamesTime,
    GamesHistory,
    GamesShares,
    GamesCryptos,
    GamesWork,
    GamesUsers,
    GamesTickerService,
    RoomsSocketGateway,
    SocketNameSpacerService,
    GamesWsEmitter,
    GamesModifiers,
    GamesDeposits,
    GamesCredits,
    GamesTaxes,
    GamesExpenses,
    GamesNews,
  ],
})
export class GamesModule {}
