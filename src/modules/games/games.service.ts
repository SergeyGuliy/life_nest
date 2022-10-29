import { Inject, Injectable } from '@nestjs/common';
import {
  Game,
  GameDocument,
} from '@modules-helpers/entities-services/games/games.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RoomsManager } from '@modules-helpers/entities-services/rooms/rooms.service';
import { GamesWsEmitter } from '@modules/games/ws/games.ws-emitter';
import { GamesTime } from '@modules/games/games-modules/games-time';

@Injectable()
export class GamesService {
  @InjectModel(Game.name)
  private gameModel: Model<GameDocument>;
  @Inject(RoomsManager)
  private readonly roomsManager: RoomsManager;
  @Inject(GamesWsEmitter)
  private gamesWsEmitter: GamesWsEmitter;
  @Inject(GamesTime)
  private gamesTime: GamesTime;

  private gamesRunning = {};

  public getGameById(gameId) {
    return this.gameModel.findById(gameId);
  }

  public async startGame(roomId, gameSettings) {
    const createdGame = new this.gameModel({
      roomId,
      gameSettings,
      gameData: {
        currentDate: this.gamesTime.getDate(),
      },
    });
    const game = await createdGame.save();

    const gameId = game._id.toString();
    await this.roomsManager.db.update(roomId, { gameId });
    this.gamesWsEmitter.startGame(roomId, game);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.gameTicker(roomId, { gameId, gameSettings: game.gameSettings });

    return;
  }

  private gameTicker(roomId, { gameId, gameSettings }) {
    console.log('----------------start----------------');
    console.log(`roomId = ${roomId}`);
    console.log(`gameId = ${gameId}`);
    this.gamesRunning[gameId] = setInterval(() => {
      this.gameTick(roomId, gameId);
    }, gameSettings.timePerTurn * 1000);
  }

  private async gameTick(roomId, gameId) {
    console.log('----------------tick----------------');
    console.log(`roomId = ${roomId}`);
    console.log(`gameId = ${gameId}`);

    const game = await this.gameModel.findById(gameId);

    game.gameData.currentDate = this.updateTime(game.gameData.currentDate);
    await this.gameModel.updateOne({ _id: gameId }, game);
    console.log(game.gameData.currentDate);
    this.gamesWsEmitter.gameTick(roomId);
  }

  private updateTime(currentDate) {
    return this.gamesTime.incrementMonth(currentDate.date);
  }

  public stopGame(gameId) {
    if (this.gamesRunning[gameId]) {
      clearInterval(this.gamesRunning[gameId]);
      delete this.gamesRunning[gameId];
    }
  }
}
