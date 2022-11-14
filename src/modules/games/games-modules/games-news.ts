import { Injectable } from '@nestjs/common';

@Injectable()
export class GamesNews {
  public getOrCreateUserHistory(tickUserNews, userId) {
    const userHistory = tickUserNews.find((i) => i.userId === userId);

    if (userHistory) return userHistory;

    tickUserNews.push({
      userId,
      creditTick: [],
      creditEnd: [],

      depositTick: [],
      depositEnd: [],

      expanses: {},
      salary: null,
      total: null,
    });
    return tickUserNews.find((i) => i.userId === userId);
  }
}
