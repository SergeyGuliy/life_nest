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
import { GamesHistory } from '@modules/games/games-modules/games-history';
import { GamesShares } from '@modules/games/games-modules/games-shares';
import { GamesCryptos } from '@modules/games/games-modules/games-cryptos';

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
  @Inject(GamesHistory)
  private gamesHistory: GamesHistory;
  @Inject(GamesShares)
  private gamesShares: GamesShares;
  @Inject(GamesCryptos)
  private gamesCryptos: GamesCryptos;

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

      shares: this.gamesShares.generateBasicShares(),
      cryptos: this.gamesCryptos.generateBasicCryptos(),
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
    let game = await this.gameModel.findById(gameId);

    // Save latest gameData in history
    game = this.gamesHistory.saveHistory(game);

    // Set new date in current session
    game.gameData.currentDate = this.gamesTime.incrementMonth(
      game.gameData.currentDate.date,
    );

    // Recalculate users data
    game.gameData.usersData = game.gameData.usersData.map(
      this.gamesUsers.calculateTickUserData,
    );

    // Save current game in mongodb
    await this.gameModel.updateOne({ _id: gameId }, game);

    // Send tick data to users
    this.gamesWsEmitter.gameTick(roomId, {
      currentDate: game.gameData.currentDate,
      shares: game.shares.map(({ history, ...shareData }) => shareData),
      cryptos: game.cryptos.map(({ history, ...cryptoData }) => cryptoData),
    });

    // Send for each user its own userData
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
