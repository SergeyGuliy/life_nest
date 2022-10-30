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
import { UsersManager } from '@modules-helpers/entities-services/users/users.service';
import { GamesUsers } from '@modules/games/games-modules/games-users';

@Injectable()
export class GamesTickerService {
  @InjectModel(Game.name)
  private gameModel: Model<GameDocument>;
  @Inject(RoomsManager)
  private readonly roomsManager: RoomsManager;
  @Inject(UsersManager)
  private readonly usersManager: UsersManager;

  @Inject(GamesWsEmitter)
  private gamesWsEmitter: GamesWsEmitter;
  @Inject(GamesTime)
  private gamesTime: GamesTime;
  @Inject(GamesUsers)
  private gamesUsers: GamesUsers;

  private gamesRunning = {};

  private async generateBacisGame(roomId, gameSettings) {
    const usersInRoom = await this.usersManager.getUsersInRoom(roomId);
    const usersInGameIds = usersInRoom.map(({ userId }) => userId);
    const { userId } = await this.usersManager.db.findOne({
      where: { roomCreatedId: roomId },
    });

    const createdGame = new this.gameModel({
      roomId,
      gameSettings,
      gameAdmin: userId,
      gameUsers: usersInGameIds,
      gameData: {
        currentDate: this.gamesTime.getDate(),
        usersData: usersInGameIds.map(this.gamesUsers.generateBasicUser),
      },
      gameHistory: [],

      shares: [],
      cryptocurrencies: [],
    });

    const game = await createdGame.save();

    const gameId = game._id.toString();

    await this.roomsManager.db.update(roomId, { gameId });

    return { game, gameId };
  }

  public async startGame(roomId, gameSettings) {
    const { game, gameId } = await this.generateBacisGame(roomId, gameSettings);

    this.gamesWsEmitter.startGame(roomId, game);

    this.gameTicker(roomId, { gameId, gameSettings: game.gameSettings });

    return;
  }

  private gameTicker(roomId, { gameId, gameSettings }) {
    this.gamesRunning[gameId] = setInterval(() => {
      this.gameTick(roomId, gameId);
    }, gameSettings.timePerTurn * 1000);
  }

  private async gameTick(roomId, gameId) {
    const game = await this.gameModel.findById(gameId);

    game.gameData.currentDate = this.gamesTime.incrementMonth(
      game.gameData.currentDate.date,
    );

    game.gameHistory = [...game.gameHistory, game.gameData];

    await this.gameModel.updateOne({ _id: gameId }, game);

    this.gamesWsEmitter.gameTick(roomId, {
      currentDate: game.gameData.currentDate,
      shares: [],
      cryptocurrencies: [],
    });

    game.gameData.usersData.forEach((userData) => {
      this.gamesWsEmitter.sendUserData(userData.userId, userData);
    });
  }

  public stopGame(gameId) {
    if (this.gamesRunning[gameId]) {
      clearInterval(this.gamesRunning[gameId]);
      delete this.gamesRunning[gameId];
    }
  }
}
