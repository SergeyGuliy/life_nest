import { Injectable } from '@nestjs/common';

@Injectable()
export class GamesHistory {
  saveHistory(game) {
    return [...game.gameHistory, game.gameData];
  }
}
