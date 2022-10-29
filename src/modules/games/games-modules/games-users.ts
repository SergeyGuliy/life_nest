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
      cryptocurrency: [],
      deposits: [],
      credits: [],
    };
  }
}
