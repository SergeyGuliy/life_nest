import { Injectable } from '@nestjs/common';

@Injectable()
export class GamesUsers {
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

  public calculateTickUserData(oldUserData) {
    return {
      ...oldUserData,
      cash: oldUserData.cash + 100,
    };
  }
}
