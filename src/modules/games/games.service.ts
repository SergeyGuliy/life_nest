import { Inject, Injectable } from '@nestjs/common';
import {
  Game,
  GameDocument,
} from '@modules-helpers/entities-services/games/games.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { GamesTickerService } from '@modules/games/games-ticker.service';

@Injectable()
export class GamesService {
  @InjectModel(Game.name)
  private gameModel: Model<GameDocument>;

  @Inject(GamesTickerService)
  private gamesTickerService: GamesTickerService;

  public async getGameById(gameId) {
    const game = await this.gameModel.findById(gameId);
    delete game.gameHistory;
    return game;
  }

  public startGame(roomId, gameSettings) {
    return this.gamesTickerService.startGame(roomId, gameSettings);
  }

  public stopGame(gameId) {
    this.gamesTickerService.stopGame(gameId);
  }
}
