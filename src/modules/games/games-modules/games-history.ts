import { Injectable } from '@nestjs/common';

@Injectable()
export class GamesHistory {
  private saveCryptos(cryptos, date) {
    cryptos.forEach(({ history, ...cryptoData }) => {
      history.push({
        ...cryptoData,
        date,
      });
    });
    return cryptos;
  }

  public save(game) {
    game.gameHistory = [...game.gameHistory, game.gameData];

    game.cryptos = this.saveCryptos(game.cryptos, game.gameData.date);

    return game;
  }
}
