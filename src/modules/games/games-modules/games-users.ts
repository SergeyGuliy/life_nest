import { Inject, Injectable } from '@nestjs/common';
import { GamesWork } from '@modules/games/games-modules/games-work';

@Injectable()
export class GamesUsers {
  @Inject(GamesWork)
  private readonly gamesWork: GamesWork;

  private tickOne(oldUserData) {
    return {
      ...oldUserData,
      cash: oldUserData.cash,
    };
  }

  public tick(usersData) {
    return usersData.map(this.tickOne);
  }

  public generateBasicUser(userId) {
    return {
      userId,
      cash: 10000,
      work: this.gamesWork.generate(),
      skills: [],
      shares: [],
      cryptos: [],
      deposits: [],
      credits: [],
    };
  }
}
