import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Game,
  GameDocument,
} from '@modules-helpers/entities-services/games/games.entity';
import { Model } from 'mongoose';

@Injectable()
export class GamesCryptos {
  @InjectModel(Game.name)
  private gameModel: Model<GameDocument>;

  private generateOne(name) {
    return {
      name,
      previousPrice: 100,
      currentPrice: 100,
      history: [],
    };
  }

  private tickOne(oldCryptoData) {
    const { currentPrice } = oldCryptoData;

    const modification = 5;

    return {
      ...oldCryptoData,
      previousPrice: currentPrice,
      currentPrice:
        (currentPrice *
          (100 + (Math.random() * modification - modification / 2))) /
        100,
    };
  }

  public generate() {
    return [
      this.generateOne('BTC'),
      this.generateOne('ETH'),
      this.generateOne('BNB'),
    ];
  }

  public tick(cryptos) {
    return cryptos.map(this.tickOne);
  }

  public async getCryptoHistory({ actionData }) {
    const game = await this.gameModel.findById(actionData.gameId);
    return game.cryptos.find((crypto) => crypto.name === actionData.name)
      .history;
  }

  public async buySell({ userId, actionData }) {
    console.log(userId);
    console.log(actionData);
    return actionData;
  }
}
