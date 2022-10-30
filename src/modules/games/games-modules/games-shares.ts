import { Injectable } from '@nestjs/common';

@Injectable()
export class GamesShares {
  private generateBasicShare() {
    return {
      basePrice: 100,
      currentPrice: 100,
      yearGrow: 8,
      yearDividends: 2,
      monthOfDividends: ['Oct'],
      eps: 'eps',
      ebda: 'ebda',
      capitalization: 'capitalization',
      history: [],
      market: 'food',
    };
  }

  public generateBasicShares() {
    return [this.generateBasicShare()];
  }
}
