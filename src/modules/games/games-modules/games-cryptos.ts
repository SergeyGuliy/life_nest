import { Injectable } from '@nestjs/common';

@Injectable()
export class GamesCryptos {
  private generateOne() {
    return {
      name: 'BTC',
      currentPrice: 100,
      history: [],
    };
  }

  private tickOne(oldUserData) {
    return {
      ...oldUserData,
      cash: oldUserData.cash + 100,
    };
  }

  public generate() {
    return [this.generateOne()];
  }

  public tick(cryptos) {
    return cryptos.map(this.tickOne);
  }
}
