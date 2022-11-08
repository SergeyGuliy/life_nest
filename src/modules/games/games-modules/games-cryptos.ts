import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Game,
  GameDocument,
} from '@modules-helpers/entities-services/games/games.entity';
import { Model } from 'mongoose';
import { ErrorService } from '@modules-helpers/global-services/error-handler.service';
import { $mRandom, $mChain, $mMedian } from '@assets/mathjs/index';
import * as moment from 'moment';
import { GamesTime } from '@modules/games/games-modules/games-time';

@Injectable()
export class GamesCryptos {
  @InjectModel(Game.name)
  private gameModel: Model<GameDocument>;
  @Inject(ErrorService)
  private readonly errorService: ErrorService;
  @Inject(GamesTime)
  private readonly gamesTime: GamesTime;

  private generateOne(name) {
    const basePrice = $mRandom(50, 250);

    return {
      name,
      previousPrice: basePrice,
      currentPrice: basePrice,
      history: [],
    };
  }

  private generateBasicHistory({ history, ...cryptoData }, startDate) {
    const countOfHistory = $mRandom(5, 20, 0);

    let date: any = moment(startDate.date).subtract(countOfHistory - 1, 'M');
    date = this.gamesTime.generate(date);

    [...Array(countOfHistory).keys()].forEach(() => {
      cryptoData = {
        ...cryptoData,
        date,
      };
      history.push(cryptoData);
      cryptoData = this.tickOne(cryptoData);
      date = this.gamesTime.tick(date);
    });

    return {
      ...cryptoData,
      history,
    };
  }

  private tickOne(oldCryptoData) {
    const { currentPrice } = oldCryptoData;

    const randomMod = $mRandom(-15, 15);
    const newPrice = $mChain(currentPrice).percent(randomMod).round(2).done();

    return {
      ...oldCryptoData,
      previousPrice: currentPrice,
      currentPrice: newPrice,
    };
  }

  public generate(date) {
    let generatedCryptos: { history: any }[] = [
      this.generateOne('BTC'),
      this.generateOne('ETH'),
      this.generateOne('BNB'),
      this.generateOne('SOL'),
      this.generateOne('DOT'),
      this.generateOne('APE'),
    ];
    generatedCryptos = generatedCryptos.map((crypto) =>
      this.generateBasicHistory(crypto, date),
    );

    return generatedCryptos;
  }

  public tick(cryptos) {
    return cryptos.map(this.tickOne);
  }

  public async getCryptoHistory({ actionData, gameId }) {
    const game = await this.gameModel.findById(gameId);
    return game.cryptos.find((i) => i.name === actionData.name).history;
  }

  private getOrGenUserCrypto(cryptos, cryptoName) {
    const userCrypto = cryptos.find(({ name }) => name === cryptoName);

    return (
      userCrypto || {
        name: cryptoName,
        median: 0,
        count: 0,
      }
    );
  }

  private updateUserCrypto(cryptos, crypto) {
    const cryptoId = cryptos.findIndex(({ name }) => name === crypto.name);

    if (cryptoId >= 0) {
      cryptos[cryptoId] = crypto;
    } else {
      cryptos.push(crypto);
    }

    return cryptos;
  }

  public async buySell({ userId, actionData, gameId }) {
    const game = await this.gameModel.findById(gameId);
    const user = game.gameData.usersData.find((i) => i.userId === userId);

    const { operationType, buySell, operationPrice } = actionData;

    if (operationType === 'TAKER') {
      const crypto = game.cryptos.find((i) => i.name === actionData.name);

      if (crypto.currentPrice !== operationPrice) {
        this.errorService.e('gamePriceIsNotSame', 'en');
      }

      switch (buySell) {
        case 'BUY':
          user.cryptos = this.takerBuy(actionData, user);
          break;
        case 'SELL':
          user.cryptos = this.takerSell(actionData, user);
          break;
      }
    }

    // if (operationType === 'MAKER' && buySell === 'BUY') {
    //   user.cryptos = this.takerBuy(crypto, actionData, user);
    // } else if (operationType === 'MAKER' && buySell === 'SELL') {
    //   user.cryptos = this.takerBuy(crypto, actionData, user);
    // }

    await this.gameModel.updateOne({ _id: gameId }, game);
    return user;
  }

  private takerBuy(
    { name, operationTotal, operationPrice, operationCount },
    user,
  ) {
    const userCrypto = this.getOrGenUserCrypto(user.cryptos, name);
    user.cash = $mChain(user.cash).subtract(operationTotal).done();

    const { median, count } = userCrypto;

    const [newMedian, newCount] = $mMedian(
      [median, count],
      [operationPrice, operationCount],
    );

    userCrypto.count = newCount;
    userCrypto.median = newMedian;

    return this.updateUserCrypto(user.cryptos, userCrypto);
  }

  private takerSell({ name, operationCount, operationTotal }, user) {
    const userCrypto = this.getOrGenUserCrypto(user.cryptos, name);

    if (operationCount > userCrypto.count) {
      this.errorService.e('gameUserNotCrypto', 'en');
    }

    user.cash = $mChain(user.cash).add(operationTotal).done();

    userCrypto.count = $mChain(userCrypto.count)
      .subtract(operationCount)
      .done();

    return this.updateUserCrypto(user.cryptos, userCrypto);
  }
}
