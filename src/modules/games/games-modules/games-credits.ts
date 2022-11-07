import { Injectable } from '@nestjs/common';

const creditsDuration = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

@Injectable()
export class GamesCredits {
  public generate(keyRate = 0) {
    const credits = creditsDuration.map((duration) => {
      const calculatedPercent = (2 * (100 + duration)) / 100;

      return {
        duration,
        disabled: false,
        percent: calculatedPercent,
      };
    });
    return {
      lastRecalculation: 1,
      credits,
    };
  }

  public tick(credits, modifiers) {
    console.log(credits);
    console.log(modifiers);
    return credits;
  }
}
