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
  private readonly gameModel: Model<GameDocument>;

  @Inject(GamesTickerService)
  private readonly gamesTickerService: GamesTickerService;

  public async getGameById(gameId) {
    const game = await this.gameModel.findById(gameId);
    return {
      date: game.gameData.date,
      modifiers: game.modifiers,

      shares: game.shares.map(({ history, ...shareData }) => shareData),
      cryptos: game.cryptos.map(({ history, ...cryptoData }) => cryptoData),
      credits: game.credits,
    };
  }

  public async getUserData(gameId, userId) {
    const game = await this.gameModel.findById(gameId);
    return game.gameData.usersData.find((i) => i.userId === userId);
  }

  public startGame(roomId, gameSettings) {
    return this.gamesTickerService.startGame(roomId, gameSettings);
  }

  public stopGame(gameId) {
    this.gamesTickerService.stopGame(gameId);
  }
}
