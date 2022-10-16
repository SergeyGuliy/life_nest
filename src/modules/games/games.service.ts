import { Inject, Injectable } from '@nestjs/common';
import {
  Game,
  GameDocument,
} from '@modules-helpers/entities-services/games/games.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RoomsManager } from '@modules-helpers/entities-services/rooms/rooms.service';
import { GamesWsEmitter } from '@modules/games/ws/games.ws-emitter';

@Injectable()
export class GamesService {
  @InjectModel(Game.name)
  private gameModel: Model<GameDocument>;
  @Inject(RoomsManager)
  private readonly roomsManager: RoomsManager;
  @Inject(GamesWsEmitter)
  private gamesWsEmitter: GamesWsEmitter;

  private gamesRunning = {};

  getGameById(gameId) {
    return this.gameModel.findById(gameId);
  }

  async startGame(roomId, gameSettings) {
    const createdGame = new this.gameModel({
      roomId,
      gameSettings,
    });
    const gameData = await createdGame.save();
    const gameId = gameData._id.toString();

    await this.roomsManager.db.update(roomId, {
      gameId: gameId,
    });

    this.gamesWsEmitter.startGame(roomId, gameData);

    this.gameTicker(roomId, gameId);

    return;
  }

  private gameTicker(roomId, gameId) {
    this.gamesRunning[gameId] = setInterval(() => {
      this.gamesWsEmitter.gameTick(roomId);
    }, 1000);
  }

  public stopGame(gameId) {
    if (this.gamesRunning[gameId]) {
      clearInterval(this.gamesRunning[gameId]);
    }
  }
}
