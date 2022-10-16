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

  getGameById(gameId) {
    return this.gameModel.findById(gameId);
  }

  async startGame(roomId, gameSettings) {
    const createdGame = new this.gameModel({
      roomId,
      gameSettings,
    });
    const gameData = await createdGame.save();

    await this.roomsManager.db.update(roomId, {
      gameId: gameData._id.toString(),
    });

    this.gamesWsEmitter.startGame(roomId, gameData);
    return;
  }
}
