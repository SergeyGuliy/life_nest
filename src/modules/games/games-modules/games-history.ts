import { Injectable } from '@nestjs/common';

@Injectable()
export class GamesHistory {
  private saveCryptosHistory(cryptos, currentDate) {
    cryptos.forEach(({ history, ...cryptoData }) => {
      history.push({
        ...cryptoData,
        date: currentDate,
      });
    });
    return cryptos;
  }

  public saveHistory(game) {
    game.gameHistory = [...game.gameHistory, game.gameData];

    game.cryptos = this.saveCryptosHistory(
      game.cryptos,
      game.gameData.currentDate,
    );

    return game;
  }
}
