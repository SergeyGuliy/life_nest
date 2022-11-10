import { Injectable } from '@nestjs/common';
import {
  $mBasicParams,
  $mChain,
  $mHistory,
  $mGenerateLine,
} from '@assets/mathjs';

const arrMonth = [...Array(12).keys()];
const reportMonth = [2, 5, 8, 11];

@Injectable()
export class GamesModifiers {
  public generate() {
    const basicInflation = $mBasicParams(5, 1);
    const basicKeyRate = $mBasicParams(5, 1);
    const basicUnemployment = $mBasicParams(5, 1);
    const basicGDP = $mBasicParams(5, 1);

    const inflationHistory = arrMonth.map(
      () => +$mBasicParams(basicInflation, 0.1, 0.01),
    );
    const keyRateHistory = arrMonth.map(
      () => +$mBasicParams(basicKeyRate, 0.1, 0.01),
    );
    const unemploymentHistory = arrMonth.map(
      () => +$mBasicParams(basicUnemployment, 0.1, 0.01),
    );
    const GDPHistory = arrMonth.map(() => +$mBasicParams(basicGDP, 0.1, 0.01));

    const accumulatedInflation = inflationHistory.reduce(
      (ac, cur) =>
        $mChain(ac)
          .percent(cur / 12)
          .round(8)
          .done(),
      1,
    );

    return {
      awaiting: {
        inflation: [...$mGenerateLine(12, 0, 6)],
      },
      basic: {
        basicInflation: basicInflation,
        basicKeyRate: basicKeyRate,
        basicUnemployment: basicUnemployment,
        basicGDP: basicGDP,
      },
      inflation: {
        accumulated: accumulatedInflation,
        month1: inflationHistory[12],
        month3: $mHistory(inflationHistory, 3),
        month6: $mHistory(inflationHistory, 6),
        month12: $mHistory(inflationHistory, 12),
        history: inflationHistory,
      },
      keyRate: {
        month1: keyRateHistory[12],
        month3: $mHistory(keyRateHistory, 3),
        month6: $mHistory(keyRateHistory, 6),
        month12: $mHistory(keyRateHistory, 12),
        history: keyRateHistory,
      },
      unemployment: {
        month1: unemploymentHistory[12],
        month3: $mHistory(unemploymentHistory, 3),
        month6: $mHistory(unemploymentHistory, 6),
        month12: $mHistory(unemploymentHistory, 12),
        history: unemploymentHistory,
      },
      GDP: {
        month1: GDPHistory[12],
        month3: $mHistory(GDPHistory, 3),
        month6: $mHistory(GDPHistory, 6),
        month12: $mHistory(GDPHistory, 12),
        history: GDPHistory,
      },
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

    if (!reportMonth.includes(month)) {
      return recalculateHistory(history, month1);
    }

    if (month1 <= 2 || month1 >= 20) {
      return recalculateHistory(history, month1);
    }

    const ratioInflation = month3 / basicInflation;
    const newKeyRate = $mBasicParams(
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
    const newUnemployment = $mBasicParams(
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
      basicInflation + (bonusInflation || $mBasicParams(0, 0.25, 0.01, 2));

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

  return {
    month1: newValue,
    month3: $mHistory(history, 3),
    month6: $mHistory(history, 6),
    month12: $mHistory(history, 12),
    history,
  };
}
