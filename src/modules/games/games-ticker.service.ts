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
import { GamesCredits } from '@modules/games/games-modules/games-credits';
import { GamesModifiers } from '@modules/games/games-modules/games-modificators';
import { GamesDeposits } from '@modules/games/games-modules/games-deposits';

@Injectable()
export class GamesTickerService {
  @InjectModel(Game.name)
  private readonly gameModel: Model<GameDocument>;
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
        usersData: usersInGameIds.map(this.gamesUsers.generate),
      },

      shares: this.gamesShares.generate(),
      cryptos: this.gamesCryptos.generate(date),
      credits: this.gamesCredits.generate(modifiers.keyRate.month1, date),
      deposits: this.gamesDeposits.generate(modifiers.keyRate.month1, date),

      gameHistory: [],
      userDataCache: [],
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
    });

    // Send for each user its own userData
    game.gameData.usersData.forEach((userData) => {
      this.gamesWsEmitter.sendUserData(userData.userId, userData);
    });
  }

  private gameTicker(roomId, { gameId, gameSettings }) {
    this.gamesRunning[gameId] = setInterval(() => {
      this.tick(roomId, gameId);
    }, gameSettings.timePerTurn * 1000);
  }

  private async tick(roomId, gameId) {
    let game = await this.gameModel.findById(gameId);

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
    game.gameData.usersData = this.gamesUsers.tick(game.gameData.usersData);

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
