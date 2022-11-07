import { Injectable } from '@nestjs/common';
import { $m, $mChain } from '@assets/mathjs';
import { divide, round, sum } from 'mathjs';

function getPrice(history, count) {
  const filtered = history.filter((i, index) => index >= 12 - count);
  return round(divide(+sum(filtered), count), 2);
}

const modifiers = {
  GDP: 2,
  unemployment: 10,
  keyRate: 5,
  inflation: {
    accumulated: 1,
    month1: 1,
    month3: 1,
    month6: 1,
    month12: 1,
    history: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  },
};

@Injectable()
export class GamesModifiers {
  public generate() {
    return modifiers;
  }

  private calcInflation(inflation, inflationIncrement) {
    const { accumulated, history } = inflation;

    history.shift();
    history.push(inflationIncrement);

    return {
      accumulated: $mChain(accumulated).percent(inflationIncrement).done(),
      month1: inflationIncrement,
      month3: getPrice(history, 3),
      month6: getPrice(history, 6),
      month12: getPrice(history, 12),
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
