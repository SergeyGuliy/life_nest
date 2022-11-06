import { Injectable } from '@nestjs/common';
import { gamesWorks } from '@modules/games/games-modules/games-works';
import { $mRandom, $mRoundUpper } from '@assets/mathjs';

@Injectable()
export class GamesWork {
  public generate() {
    const gamesWorksCount = gamesWorks.length - 1;
    const { workData, levels } = gamesWorks[$mRandom(0, gamesWorksCount, 0)];

    const { baseSalary, level } = levels[1];

    let { min, max } = baseSalary;
    // TODO add modifications (inflation, unemployment...)
    min = min;
    // TODO add modifications (inflation, unemployment...)
    max = max;
    const randomSalary = $mRandom(min, max, 0);
    // TODO add modifications (inflation, unemployment...)
    const modifiedSalary = randomSalary;
    const roundedSalary = $mRoundUpper(modifiedSalary, 5);

    return {
      ...workData,
      salary: roundedSalary,
      trialPeriod: 0,
      level,
    };
  }

  private getInvoice(userWork) {
    const { baseSalary, chanceSuccessfulInterview, ...invoiceData } = userWork;
    const { min, max } = baseSalary;

    const randomSalary = $mRandom(min, max, 0);
    const roundedSalary = $mRoundUpper(randomSalary, 5);

    return {
      ...invoiceData,
      salary: roundedSalary,
    };
  }

  public getWorksList() {
    // TODO make filtration for available works
    const availableWorks = gamesWorks;

    return availableWorks.map(({ workData, levels }) => {
      const { level, baseSalary, trialPeriod } = levels[1];

      let { min, max } = baseSalary;
      // TODO add modifications (inflation, unemployment...)
      min = min;
      // TODO add modifications (inflation, unemployment...)
      max = max;
      // TODO make chance of a successful interview
      const chanceSuccessfulInterview = 50;

      return {
        ...workData,
        level,
        trialPeriod,
        baseSalary: { min, max },
        chanceSuccessfulInterview,
      };
    });
  }

  public goToJobInterview(userWork) {
    const randomNumber = $mRandom(0, 100);
    const isPassInterview = userWork.chanceSuccessfulInterview > randomNumber;

    if (isPassInterview) {
      return this.getInvoice(userWork);
    }
    return { code: 'failedInterview' };
  }
}
