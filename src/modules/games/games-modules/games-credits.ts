import { Injectable } from '@nestjs/common';

import { $mBase, $mChain } from '@assets/mathjs';

const creditDecreaseKeyRate = -20;
const creditsDuration = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

@Injectable()
export class GamesCredits {
  private getBaseAndStep(keyRate) {
    const step = 0.1;

    let base = $mChain(keyRate).percent(creditDecreaseKeyRate).done();
    base = $mBase(base, 0, 0.1, 1);

    return { base, step };
  }

  public generate(keyRate = 0) {
    const { base, step } = this.getBaseAndStep(keyRate);

    const credits = creditsDuration.map((duration) => {
      const stepModifiers = (12 - duration) * step;
      const calculatedPercent = $mBase(base - stepModifiers, 0, 0.1, 1);

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
}
