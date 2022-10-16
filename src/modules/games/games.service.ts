import { Inject, Injectable } from '@nestjs/common';
import {
  Game,
  GameDocument,
} from '@modules-helpers/entities-services/games/games.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RoomsManager } from '@modules-helpers/entities-services/rooms/rooms.service';

@Injectable()
export class GamesService {
  @InjectModel(Game.name)
  private gameModel: Model<GameDocument>;
  @Inject(RoomsManager)
  private readonly roomsManager: RoomsManager;

  getGameById(gameData) {
    console.log('getGameById');
    return;
  }

  async startGame(roomId, gameSettings) {
    const createdGame = new this.gameModel({
      roomId,
      gameSettings,
    });
    const game = await createdGame.save();
    await this.roomsManager.db.update(roomId, {
      gameId: game._id,
    });

    return;
  }
}
