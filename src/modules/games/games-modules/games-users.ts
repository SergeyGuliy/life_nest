import { Inject, Injectable } from '@nestjs/common';

import { $mChain } from '../../../assets/mathjs/index.js';
import { GamesWork } from './games-work.js';
import { GamesExpenses } from './games-expenses.js';
import { GamesNews } from './games-news.js';

@Injectable()
export class GamesUsers {
  @Inject(GamesWork)
  private readonly gamesWork: GamesWork;
  @Inject(GamesExpenses)
  private readonly gamesExpenses: GamesExpenses;
  @Inject(GamesNews)
  private readonly gamesNews: GamesNews;

  private tickOne(oldUserData, accumulatedInflation, tickUserNews) {
    let cashIncome: any = 0;

    const userHistory = this.gamesNews.getOrCreateUserHistory(
      tickUserNews,
      oldUserData.userId,
    );

    oldUserData.expanses = this.gamesExpenses.tick(
      oldUserData.expanses,
      accumulatedInflation,
    );

    if (oldUserData.work) {
      // TODO check is fired

      // TODO make minus taxes
      const salaryWithTaxes = oldUserData.work.salary - 0;
      cashIncome = cashIncome + salaryWithTaxes;
      userHistory.salary = {
        brutto: salaryWithTaxes,
        netto: salaryWithTaxes,
        tax: 20,
      };
    }

    if (oldUserData.credits.length) {
      oldUserData.credits = oldUserData.credits
        .map((credit) => {
          const newDuration = credit.duration - 1;

          cashIncome = cashIncome - credit.perMonth;
          userHistory.creditTick.push({
            netto: -credit.perMonth,
          });

          if (newDuration === 0) {
            cashIncome = cashIncome - credit.cash;
            userHistory.creditEnd.push({
              netto: -credit.cash,
            });
            return;
          }
          return {
            ...credit,
            duration: newDuration,
          };
        })
        .filter((i) => !!i);
    }

    if (oldUserData.deposits.length) {
      oldUserData.deposits = oldUserData.deposits
        .map((deposit) => {
          const newDuration = deposit.duration - 1;

          cashIncome = cashIncome + deposit.perMonth;
          userHistory.depositTick.push({
            brutto: deposit.perMonth,
            netto: deposit.perMonth,
            tax: 20,
          });

          if (newDuration === 0) {
            cashIncome = cashIncome + deposit.cash;
            userHistory.depositEnd.push({
              netto: deposit.cash,
            });
            return;
          }
          return {
            ...deposit,
            duration: newDuration,
          };
        })
        .filter((i) => !!i);
    }

    Object.entries(oldUserData.expanses.actual).forEach(([key, val]) => {
      cashIncome = cashIncome - +val;
      userHistory.expanses[key] = -val;
    });

    cashIncome = $mChain(cashIncome).round(2).done();
    const cash = $mChain(oldUserData.cash).add(cashIncome).round(2).done();

    userHistory.cashIncome = cashIncome;
    userHistory.cash = cash;

    return {
      ...oldUserData,
      cash,
    };
  }

  public tick = (usersData, accumulatedInflation, tickUserNews) => {
    return usersData.map((user) =>
      this.tickOne(user, accumulatedInflation, tickUserNews),
    );
  };

  public generate = (userId, accumulatedInflation) => {
    return {
      userId,
      cash: 10000,
      work: this.gamesWork.generate(accumulatedInflation),
      skills: [],
      shares: [],
      cryptos: [],
      deposits: [],
      credits: [],
      expanses: this.gamesExpenses.generate(accumulatedInflation),
    };
  };
}
