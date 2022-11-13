import { Inject, Injectable } from '@nestjs/common';
import { GamesWork } from '@modules/games/games-modules/games-work';
import { GamesExpenses } from '@modules/games/games-modules/games-expenses';
import { $mBase, $mChain } from '@assets/mathjs';

@Injectable()
export class GamesUsers {
  @Inject(GamesWork)
  private readonly gamesWork: GamesWork;
  @Inject(GamesExpenses)
  private readonly gamesExpenses: GamesExpenses;

  private tickOne(oldUserData, accumulatedInflation) {
    let newCash = oldUserData.cash;

    oldUserData.expanses = this.gamesExpenses.tick(
      oldUserData.expanses,
      accumulatedInflation,
    );

    if (oldUserData.work) {
      // TODO check is fired

      // TODO make minus taxes
      const salaryWithTaxes = oldUserData.work.salary - 0;
      newCash = newCash + salaryWithTaxes;
    }

    if (oldUserData.credits.length) {
      oldUserData.credits = oldUserData.credits
        .map((credit) => {
          const newDuration = credit.duration - 1;

          newCash = newCash - credit.perMonth;

          if (newDuration === 0) {
            newCash = newCash - credit.cash;
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

          if (newDuration === 0) {
            newCash = newCash + deposit.cash;
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
    });
    return {
      ...oldUserData,
      cash: $mChain(newCash).round(2).done(),
    };
  }

  public tick = (usersData, accumulatedInflation) => {
    return usersData.map((user) => this.tickOne(user, accumulatedInflation));
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
