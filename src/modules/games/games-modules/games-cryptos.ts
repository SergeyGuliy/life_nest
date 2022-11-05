import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Game,
  GameDocument,
} from '@modules-helpers/entities-services/games/games.entity';
import { Model } from 'mongoose';
import { ErrorHandlerService } from '@modules-helpers/global-services/error-handler.service';
import { $math, $mMethods } from '@assets/mathjs/index';
import { GamesTime } from '@modules/games/games-modules/games-time';

@Injectable()
export class GamesCryptos {
  @InjectModel(Game.name)
  private gameModel: Model<GameDocument>;
  @Inject(ErrorHandlerService)
  private readonly errorHandlerService: ErrorHandlerService;
  @Inject(GamesTime)
  private gamesTime: GamesTime;

  private generateOne(name) {
    return {
      name,
      previousPrice: 100,
      currentPrice: 100,
      history: [],
    };
  }

  private generateBasicHistory(generatedCryptos) {
    return {
      name,
      previousPrice: 100,
      currentPrice: 100,
      history: [],
    };
  }

  private tickOne(oldCryptoData) {
    const { currentPrice } = oldCryptoData;

    const randomMod = $mMethods.$mRandom(-5, 5);
    const newPricePrice = $mMethods
      .$mChain(currentPrice)
      .percent(randomMod)
      .done();

    return {
      ...oldCryptoData,
      previousPrice: currentPrice,
      currentPrice: newPricePrice,
    };
  }

  public generate() {
    let generatedCryptos = [
      this.generateOne('BTC'),
      this.generateOne('ETH'),
      this.generateOne('BNB'),
    ];

    const currentDate = this.gamesTime.generate();

    generatedCryptos = generatedCryptos.map(this.generateBasicHistory);
    console.log(generatedCryptos);
    console.log(currentDate);

    return generatedCryptos;
  }

  public tick(cryptos) {
    return cryptos.map(this.tickOne);
  }

  public async getCryptoHistory({ actionData }) {
    const game = await this.gameModel.findById(actionData.gameId);
    return game.cryptos.find((i) => i.name === actionData.name).history;
  }

  public async buySell({ userId, actionData }) {
    const game = await this.gameModel.findById(actionData.gameId);
    const user = game.gameData.usersData.find((i) => i.userId === userId);
    const crypto = game.cryptos.find((i) => i.name === actionData.name);

    if (actionData.operationType === 'TAKER') {
      if (crypto.currentPrice !== actionData.operationPrice) {
        this.errorHandlerService.error('gamePriceIsNotSame', 'en');
      }

      if (actionData.operationTotal > user.cash) {
        this.errorHandlerService.error('gameUserNotEnoughCash', 'en');
      } else {
        user.cash = user.cash - actionData.operationTotal;
      }

      const userCrypto = user.cryptos.find((i) => i.name === actionData.name);

      if (!userCrypto) {
        user.cryptos.push({
          name: actionData.name,
          mediumPrice: actionData.operationPrice,
          totalCount: actionData.operationCount,
        });
      } else {
        const oldTotalCount = userCrypto.totalCount;
        const oldMediumPrice = userCrypto.mediumPrice;
        const oldFullPrice = oldTotalCount * oldMediumPrice;

        const newFullCount = userCrypto.totalCount + actionData.operationCount;
        const newFullPrice =
          actionData.operationPrice * actionData.operationCount;

        userCrypto.totalCount = newFullCount;
        userCrypto.mediumPrice = (oldFullPrice + newFullPrice) / newFullCount;
      }
    }

    if (actionData.operationType === 'MAKER') {
      // TODO make in future
    }

    console.log(game.gameData.usersData);

    await this.gameModel.updateOne({ _id: actionData.gameId }, game);
    return user;
  }
}
