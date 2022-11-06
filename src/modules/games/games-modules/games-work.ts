import { Injectable } from '@nestjs/common';
import { gamesWorks } from '@modules/games/games-modules/games-works';
import { $mRandom } from '@assets/mathjs';

@Injectable()
export class GamesWork {
  public generateWork() {
    const gamesWorksCount = gamesWorks.length - 1;
    return gamesWorks[$mRandom(0, gamesWorksCount, 0)];
  }
}
