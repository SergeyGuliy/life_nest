import { Injectable } from '@nestjs/common';

const creditsDuration = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

@Injectable()
export class GamesCredits {
  public generate() {
    const credits = creditsDuration.map((duration) => {
      const calculatedPercent = 2;
      return {
        duration,
        percent: calculatedPercent,
      };
    });
    return {
      lastRecalculation: 1,
      credits,
    };
  }

  public recalcCredits(creditsData, modificators) {
    console.log('recalcCredits')
  }
}
