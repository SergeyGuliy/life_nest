import { Injectable } from '@nestjs/common';

@Injectable()
export class GamesHistory {
  private saveCryptosHistory(cryptos) {
    cryptos.forEach(({ history, ...cryptoData }) => {
      history.push(cryptoData);
    });
    return cryptos;
  }

  public saveHistory(game) {
    game.gameHistory = [...game.gameHistory, game.gameData];

    game.cryptos = this.saveCryptosHistory(game.cryptos);

    return game;
  }
}
