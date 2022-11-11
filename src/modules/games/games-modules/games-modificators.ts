import { Injectable } from '@nestjs/common';
import { $mBase, $mChain, $mHistory, $mGenerateLine } from '@assets/mathjs';

import { reportMonths, months } from '../constants';

@Injectable()
export class GamesModifiers {
  public generate() {
    const basicInflation = $mBase(5, 1);
    const basicKeyRate = $mBase(5, 1);
    const basicUnemployment = $mBase(5, 1);
    const basicGDP = $mBase(5, 1);

    const inflationHist = months.map(() => $mBase(basicInflation, 0.1, 0.01));
    const keyRateHist = months.map(() => $mBase(basicKeyRate, 0.1, 0.01));
    const unemployHist = months.map(() => $mBase(basicUnemployment, 0.1, 0.01));
    const GDPHist = months.map(() => $mBase(basicGDP, 0.1, 0.01));

    const accumulatedInflation = inflationHist.reduce(
      (ac, cur) =>
        $mChain(ac)
          .percent(+cur / 12)
          .round(8)
          .done(),
      1,
    );

    return {
      awaiting: {
        inflation: [...$mGenerateLine(12, 0, 12)],
      },
      basic: {
        basicInflation: basicInflation,
        basicKeyRate: basicKeyRate,
        basicUnemployment: basicUnemployment,
        basicGDP: basicGDP,
      },
      inflation: {
        accumulated: accumulatedInflation,
        ...generateHistory(inflationHist),
      },
      keyRate: generateHistory(keyRateHist),
      unemployment: generateHistory(unemployHist),
      GDP: generateHistory(GDPHist),
    };
  }

  private calcInflation(inflation, inflationIncrement) {
    const { accumulated, history } = inflation;
    const newInflation = $mChain(accumulated)
      .percent(inflationIncrement / 12)
      .round(8)
      .done();

    return {
      accumulated: newInflation,
      ...recalculateHistory(history, inflationIncrement),
    };
  }

  private calcKeyRate(
    keyRate,
    { month3 },
    { basicKeyRate, basicInflation },
    month,
  ) {
    const { month1, history } = keyRate;

    if (!reportMonths.includes(month)) {
      return recalculateHistory(history, month1);
    }

    if (month1 <= 2 || month1 >= 20) {
      return recalculateHistory(history, month1);
    }

    const ratioInflation = month3 / basicInflation;
    const newKeyRate = $mBase(
      basicKeyRate + (month3 - basicInflation),
      0,
      0.25,
      1,
    );

    if (ratioInflation >= 1.1) {
      return recalculateHistory(history, newKeyRate);
    } else if (ratioInflation >= 0.9) {
      return recalculateHistory(history, newKeyRate);
    }
    return recalculateHistory(history, month1);
  }

  private calcUnemployment(
    unemployment,
    { month3 },
    { basicUnemployment, basicInflation },
  ) {
    const { month1, history } = unemployment;
    if (month1 <= 2 || month1 >= 20) {
      return recalculateHistory(history, month1);
    }
    const ratioKeyRate = month3 / basicUnemployment;
    const newUnemployment = $mBase(
      basicUnemployment + (month3 - basicInflation),
      0,
      0.1,
      1,
    );

    if (ratioKeyRate >= 1.1) {
      return recalculateHistory(history, newUnemployment);
    } else if (ratioKeyRate >= 0.9) {
      return recalculateHistory(history, newUnemployment);
    }
    return recalculateHistory(history, month1);
  }

  public tick(
    { awaiting, basic, inflation, keyRate, unemployment, GDP },
    { month },
  ) {
    const { basicInflation, basicKeyRate, basicUnemployment, basicGDP } = basic;

    const bonusInflation = awaiting.inflation.shift();
    const currentInflation =
      basicInflation + (bonusInflation || $mBase(0, 0.25, 0.01, 2));

    const newUnemployment = this.calcUnemployment(unemployment, keyRate, basic);
    const newKeyRate = this.calcKeyRate(keyRate, inflation, basic, month);
    const newInflation = this.calcInflation(inflation, currentInflation);

    return {
      awaiting,
      basic,
      inflation: newInflation,
      keyRate: newKeyRate,
      unemployment: newUnemployment,
      GDP,
    };
  }
}

function recalculateHistory(history, newValue) {
  history.shift();
  history.push(newValue);

  return generateHistory(history);
}

function generateHistory(history) {
  return {
    month1: history[12],
    month3: $mHistory(history, 3),
    month6: $mHistory(history, 6),
    month12: $mHistory(history, 12),
    history,
  };
}
