import { Injectable } from '@nestjs/common';

@Injectable()
export class GamesUsers {
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
      work: null,
      skills: [],
      shares: [],
      cryptos: [],
      deposits: [],
      credits: [],
    };
  }
}
