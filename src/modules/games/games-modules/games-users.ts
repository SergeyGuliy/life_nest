import { Injectable } from '@nestjs/common';

@Injectable()
export class GamesUsers {
  private calculateTick(oldUserData) {
    return {
      ...oldUserData,
      cash: oldUserData.cash + 100,
    };
  }

  public tick(usersData) {
    return usersData.map(this.calculateTick);
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
