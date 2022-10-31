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

    return {
      ...oldCryptoData,
      previousPrice: currentPrice,
      currentPrice: (currentPrice * (100 + (Math.random() * 10 - 5))) / 100,
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

  public async getCryptoHistory({ gameId, name }) {
    const game = await this.gameModel.findById(gameId);
    return game.cryptos.find((crypto) => crypto.name === name).history;
  }
}
