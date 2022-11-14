import { Inject, Injectable } from '@nestjs/common';
import { GamesWork } from '@modules/games/games-modules/games-work';
import { GamesExpenses } from '@modules/games/games-modules/games-expenses';
import { $mChain } from '@assets/mathjs';
import { GamesNews } from '@modules/games/games-modules/games-news';

@Injectable()
export class GamesUsers {
  @Inject(GamesWork)
  private readonly gamesWork: GamesWork;
  @Inject(GamesExpenses)
  private readonly gamesExpenses: GamesExpenses;
  @Inject(GamesNews)
  private readonly gamesNews: GamesNews;

  private tickOne(oldUserData, accumulatedInflation, tickUserNews) {
    let newCash = oldUserData.cash;

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
      newCash = newCash + salaryWithTaxes;
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

          newCash = newCash - credit.perMonth;
          userHistory.creditTick.push({
            netto: -credit.perMonth,
          });

          if (newDuration === 0) {
            newCash = newCash - credit.cash;
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

          newCash = newCash + deposit.perMonth;
          userHistory.depositTick.push({
            brutto: deposit.perMonth,
            netto: deposit.perMonth,
            tax: 20,
          });

          if (newDuration === 0) {
            newCash = newCash + deposit.cash;
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
      newCash = newCash - +val;
      userHistory.expanses[key] = val;
    });

    const total = $mChain(newCash).round(2).done();

    userHistory.total = total;

    return {
      ...oldUserData,
      cash: total,
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
