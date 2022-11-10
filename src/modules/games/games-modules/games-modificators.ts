import { Injectable } from '@nestjs/common';
import {
  $mBasicParams,
  $mChain,
  $mHistory,
  $mGenerateLine,
} from '@assets/mathjs';
import { round } from 'mathjs';

// console.log($mGenerateLine(30, 0, 3));
// console.log($mGenerateLine(30, 0, 3));
// console.log($mGenerateLine(30, 0, 3));
// console.log($mGenerateLine(30, 0, 3));
const arrMonth = [...Array(12).keys()];

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
        inflation: [...$mGenerateLine(60, 0, 12)],
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
        month1: basicKeyRate,
        month3: basicKeyRate,
        month6: basicKeyRate,
        month12: basicKeyRate,
        history: arrMonth.map(() => basicKeyRate),
      },
      unemployment: {
        month1: basicUnemployment,
        month3: basicUnemployment,
        month6: basicUnemployment,
        month12: basicUnemployment,
        history: arrMonth.map(() => basicUnemployment),
      },
      GDP: {
        month1: basicGDP,
        month3: basicGDP,
        month6: basicGDP,
        month12: basicGDP,
        history: arrMonth.map(() => basicGDP),
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

  private calcKeyRate(keyRate, { basicKeyRate, basicInflation }, { month3 }) {
    const { month1, history } = keyRate;
    if (month1 <= 2 || month1 >= 20) {
      console.log('-------------- UNEXPECTED CRISIS --------------');
      return keyRate;
    }

    const ratioInflation = month3 / basicInflation;

    if (ratioInflation >= 1.05) {
      console.log('------------- RAISE KEY RATE -------------');
      const newKeyRate = basicKeyRate + (month3 - basicInflation);
      return recalculateHistory(history, newKeyRate);
    } else if (ratioInflation >= 0.95 && month1 > basicKeyRate) {
      console.log('------------ DECREASE KEY RATE -----------');
      const newKeyRate = basicKeyRate + (month3 - basicInflation);
      return recalculateHistory(history, newKeyRate);
    } else {
      console.log('--------------- PRINT MONEY --------------');
      return keyRate;
    }
  }

  private calcUnemployment(newKeyRate) {
    return round(newKeyRate * 1.5, 2);
  }

  public tick({ awaiting, basic, inflation, keyRate, unemployment, GDP }) {
    const { basicInflation, basicKeyRate, basicUnemployment, basicGDP } = basic;
    const bonusInflation = awaiting.inflation.shift();
    const currentInflation = basicInflation + bonusInflation;

    const newKeyRate = this.calcKeyRate(keyRate, basic, inflation);
    // const newUnemployment = this.calcUnemployment(newKeyRate);
    const newInflation = this.calcInflation(
      inflation,
      currentInflation + basicInflation,
    );

    return {
      awaiting,
      basic,
      inflation: newInflation,
      keyRate: newKeyRate,
      unemployment: unemployment,
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
