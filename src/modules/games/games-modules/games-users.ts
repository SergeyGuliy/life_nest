import { Injectable } from '@nestjs/common';

@Injectable()
export class GamesUsers {
  private tickOne(oldUserData) {
    return {
      ...oldUserData,
      cash: oldUserData.cash + 100,
    };
  }

  public tick(usersData) {
    return usersData.map(this.tickOne);
  }

  public generateBasicUser(userId) {
    return {
      userId,
      cash: 100,
      work: null,
      skills: [],
      shares: [],
      cryptos: [],
      deposits: [],
      credits: [],
    };
  }
}
