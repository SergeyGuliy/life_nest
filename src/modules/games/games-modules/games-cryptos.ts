import { Injectable } from '@nestjs/common';

@Injectable()
export class GamesCryptos {
  private generateBasicCrypto() {
    return {
      name: 'BTC',
      currentPrice: 100,
      history: [],
    };
  }

  public generateBasicCryptos() {
    return [this.generateBasicCrypto()];
  }
}
