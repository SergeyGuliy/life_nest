import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Types from 'mongoose';

import {
  Game,
  GameDocument,
} from '../../modules-helpers/entities-services/games/games.entity.js';
import { GamesTickerService } from './games-ticker.service.js';

@Injectable()
export class GamesService {
  @InjectModel(Game.name)
  private readonly gameModel: Types.Model<GameDocument>;

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
      deposits: game.deposits,
      tickGameNews: game.tickGameNews,
    };
  }

  public async getUserData(gameId, userId) {
    const game = await this.gameModel.findById(gameId);
    return {
      userData: game.gameData.usersData.find((i) => i.userId === userId),
      userNews: game.tickUserNews.find((i) => i.userId === userId),
    };
  }

  public startGame(roomId, gameSettings) {
    return this.gamesTickerService.startGame(roomId, gameSettings);
  }

  public stopGame(gameId) {
    this.gamesTickerService.stopGame(gameId);
  }
}
