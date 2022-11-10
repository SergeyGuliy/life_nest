import { Injectable } from '@nestjs/common';
import {
  $mBasicParams,
  $mChain,
  $mHistory,
  $mGenerateLine,
} from '@assets/mathjs';
import { round } from 'mathjs';

console.log($mGenerateLine(30, 0, 3));
console.log($mGenerateLine(30, 0, 3));
console.log($mGenerateLine(30, 0, 3));
console.log($mGenerateLine(30, 0, 3));

@Injectable()
export class GamesModifiers {
  public generate() {
    const basicInflation = $mBasicParams(5, 1);
    const basicKeyRate = $mBasicParams(5, 1);
    const basicUnemployment = $mBasicParams(5, 1);
    const basicGDP = $mBasicParams(5, 1);
    const inflationHistory = [...Array(12).keys()].map(
      () => +$mBasicParams(basicInflation, 0.1, 0.01),
    );
    const accumulatedInflation = inflationHistory.reduce(
      (ac, cur) =>
        $mChain(ac)
          .percent(cur / 12)
          .round(8)
          .done(),
      1,
    );

    return {
      basic: {
        inflation: basicInflation,
        keyRate: basicKeyRate,
        unemployment: basicUnemployment,
        GDP: basicGDP,
      },
      inflation: {
        accumulated: accumulatedInflation,
        month1: inflationHistory[12],
        month3: $mHistory(inflationHistory, 3),
        month6: $mHistory(inflationHistory, 6),
        month12: $mHistory(inflationHistory, 12),
        history: inflationHistory,
      },
      keyRate: basicKeyRate,
      unemployment: basicUnemployment,
      GDP: basicGDP,
    };
  }

  private calcInflation(inflation, inflationIncrement) {
    const { accumulated, history } = inflation;

    history.shift();
    history.push(inflationIncrement);

    return {
      accumulated: $mChain(accumulated)
        .percent(inflationIncrement / 12)
        .round(8)
        .done(),
      month1: inflationIncrement,
      month3: $mHistory(history, 3),
      month6: $mHistory(history, 6),
      month12: $mHistory(history, 12),
      history,
    };
  }

  private calcKeyRate(keyRate, { month3 }) {
    if (keyRate <= 2 || keyRate >= 20) return keyRate;

    if (month3 > 12) {
      return keyRate + 0.25;
    } else if (month3 < 6) {
      return keyRate - 0.25;
    }
    return keyRate;
  }

  private calcUnemployment(newKeyRate) {
    return round(newKeyRate * 1.5, 2);
  }

  public tick(modifiers, inflationIncrement = 1) {
    const { GDP, unemployment, keyRate, inflation } = modifiers;

    const newInflation = this.calcInflation(inflation, inflationIncrement);
    const newKeyRate = this.calcKeyRate(keyRate, newInflation);
    const newUnemployment = this.calcUnemployment(newKeyRate);

    return {
      GDP,
      unemployment: newUnemployment,
      keyRate: newKeyRate,
      inflation: newInflation,
    };
  }
}
