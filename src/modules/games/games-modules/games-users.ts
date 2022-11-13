import { Inject, Injectable } from '@nestjs/common';
import { GamesWork } from '@modules/games/games-modules/games-work';

@Injectable()
export class GamesUsers {
  @Inject(GamesWork)
  private readonly gamesWork: GamesWork;

  private tickOne(oldUserData) {
    let newCash = oldUserData.cash;

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

    return {
      ...oldUserData,
      cash: newCash,
    };
  }

  public tick(usersData) {
    return usersData.map(this.tickOne);
  }

  public generate = (userId) => {
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
  };
}
