import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Types from 'mongoose';

import {
  Game,
  GameDocument,
} from '../../modules-helpers/entities-services/games/games.entity.js';

import { RoomsManager } from '../../modules-helpers/entities-services/rooms/rooms.service.js';
import { GamesWsEmitter } from '../../modules/games/ws/games.ws-emitter.js';
import { GamesTime } from '../../modules/games/games-modules/games-time.js';
import { UsersManager } from '../../modules-helpers/entities-services/users/users.service.js';
import { GamesUsers } from '../../modules/games/games-modules/games-users.js';
import { GamesHistory } from '../../modules/games/games-modules/games-history.js';
import { GamesShares } from '../../modules/games/games-modules/games-shares.js';
import { GamesCryptos } from '../../modules/games/games-modules/games-cryptos.js';
import { GamesCredits } from '../../modules/games/games-modules/games-credits.js';
import { GamesModifiers } from '../../modules/games/games-modules/games-modificators.js';
import { GamesDeposits } from '../../modules/games/games-modules/games-deposits.js';

@Injectable()
export class GamesTickerService {
  @InjectModel(Game.name)
  private readonly gameModel: Types.Model<GameDocument>;
  @Inject(RoomsManager)
  private readonly roomsManager: RoomsManager;
  @Inject(UsersManager)
  private readonly usersManager: UsersManager;

  @Inject(GamesWsEmitter)
  private readonly gamesWsEmitter: GamesWsEmitter;
  @Inject(GamesTime)
  private readonly gamesTime: GamesTime;
  @Inject(GamesUsers)
  private readonly gamesUsers: GamesUsers;
  @Inject(GamesHistory)
  private readonly gamesHistory: GamesHistory;
  @Inject(GamesShares)
  private readonly gamesShares: GamesShares;
  @Inject(GamesCryptos)
  private readonly gamesCryptos: GamesCryptos;
  @Inject(GamesCredits)
  private readonly gamesCredits: GamesCredits;
  @Inject(GamesDeposits)
  private readonly gamesDeposits: GamesDeposits;
  @Inject(GamesModifiers)
  private readonly gamesModifiers: GamesModifiers;

  private gamesRunning = {};

  private async generate(roomId, gameSettings) {
    const usersInRoom = await this.usersManager.getUsersInRoom(roomId);
    const usersInGameIds = usersInRoom.map(({ userId }) => userId);
    const { userId } = await this.usersManager.db.findOne({
      where: { roomCreatedId: roomId },
    });

    const date = this.gamesTime.generate();
    const modifiers = this.gamesModifiers.generate();

    const createdGame = new this.gameModel({
      roomId,
      gameSettings,
      gameAdmin: userId,
      gameUsers: usersInGameIds,

      modifiers,
      gameData: {
        date,
        usersData: usersInGameIds.map((u) =>
          this.gamesUsers.generate(u, modifiers.inflation.accumulated),
        ),
      },

      shares: this.gamesShares.generate(),
      cryptos: this.gamesCryptos.generate(date),
      credits: this.gamesCredits.generate(modifiers.keyRate.month1, date),
      deposits: this.gamesDeposits.generate(modifiers.keyRate.month1, date),

      gameHistory: [],

      userDataCache: [],

      tickUserNews: [],
      tickGameNews: [],
    });

    const game = await createdGame.save();

    const gameId = game._id.toString();

    await this.roomsManager.db.update(roomId, { gameId });

    return { game, gameId };
  }

  public async startGame(roomId, gameSettings) {
    const { game, gameId } = await this.generate(roomId, gameSettings);

    this.gamesWsEmitter.startGame(roomId, game);

    this.gameTicker(roomId, { gameId, gameSettings: game.gameSettings });

    return;
  }

  private sendTick(roomId, game) {
    // Send tick data to users
    this.gamesWsEmitter.sendTick(roomId, {
      date: game.gameData.date,
      modifiers: game.modifiers,

      shares: game.shares.map(({ history, ...shareData }) => shareData),
      cryptos: game.cryptos.map(({ history, ...cryptoData }) => cryptoData),
      credits: game.credits,
      deposits: game.deposits,
      tickGameNews: game.tickGameNews,
    });

    // Send for each user its own userData
    game.gameData.usersData.forEach((userData) => {
      this.gamesWsEmitter.sendUserData(userData.userId, {
        userData,
        userNews: game.tickUserNews.find((i) => i.userId === userData.userId),
      });
    });
  }

  private gameTicker(roomId, { gameId, gameSettings }) {
    this.gamesRunning[gameId] = setInterval(() => {
      this.tick(roomId, gameId);
    }, gameSettings.timePerTurn * 1000);
  }

  private async tick(roomId, gameId) {
    let game = await this.gameModel.findById(gameId);

    game.tickUserNews = [];
    game.tickGameNews = [];

    // Save latest gameData in history
    game = this.gamesHistory.save(game);

    // Set new date in current session
    game.gameData.date = this.gamesTime.tick(game.gameData.date);

    // Recalculate modifiers: (inflation, keyRate, unemployment)
    game.modifiers = this.gamesModifiers.tick(
      game.modifiers,
      game.gameData.date,
    );

    // Recalculate credits
    game.credits = this.gamesCredits.generate(
      game.modifiers.keyRate.month1,
      game.gameData.date,
      game.credits,
    );

    // Recalculate credits
    game.deposits = this.gamesDeposits.generate(
      game.modifiers.keyRate.month1,
      game.gameData.date,
      game.deposits,
    );

    // Recalculate users data
    game.gameData.usersData = this.gamesUsers.tick(
      game.gameData.usersData,
      game.modifiers.inflation.accumulated,
      game.tickUserNews,
    );

    // Recalculate cryptos data
    game.cryptos = this.gamesCryptos.tick(game.cryptos);

    // CLean tick cache
    game.userDataCache = [];

    // Save current game in mongodb
    await this.gameModel.updateOne({ _id: gameId }, game);

    this.sendTick(roomId, game);
  }

  public stopGame(gameId) {
    if (this.gamesRunning[gameId]) {
      clearInterval(this.gamesRunning[gameId]);
      delete this.gamesRunning[gameId];
    }
  }
}
