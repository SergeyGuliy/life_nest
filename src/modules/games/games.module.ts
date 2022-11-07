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
import {
  GamesSettings,
  GamesSettingsEntity,
} from '@modules-helpers/entities-services/games/games-settings.entity';
import { GamesWsEmitter } from '@modules/games/ws/games.ws-emitter';
import { GamesTime } from '@modules/games/games-modules/games-time';
import { GamesHistory } from '@modules/games/games-modules/games-history';
import { GamesUsers } from '@modules/games/games-modules/games-users';
import { GamesTickerService } from '@modules/games/games-ticker.service';
import { GamesShares } from '@modules/games/games-modules/games-shares';
import { GamesCryptos } from '@modules/games/games-modules/games-cryptos';
import { GamesWork } from '@modules/games/games-modules/games-work';
import { GamesModification } from '@modules/games/games-modules/games-modificators';
import { GamesDeposits } from '@modules/games/games-modules/games-deposits';
import { GamesCredits } from '@modules/games/games-modules/games-credits';

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
    GamesModification,
    GamesDeposits,
    GamesCredits,
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
    GamesModification,
    GamesDeposits,
    GamesCredits,
  ],
})
export class GamesModule {}
