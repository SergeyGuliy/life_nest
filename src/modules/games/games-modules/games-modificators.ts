import { Injectable } from '@nestjs/common';
import {
  $mBasicParams,
  $mChain,
  $mHistory,
  $mGenerateLine,
} from '@assets/mathjs';

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
        inflation: [...$mGenerateLine(24, 0, 6)],
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

  private calcKeyRate(keyRate, { month3 }, { basicKeyRate, basicInflation }) {
    const { month1, history } = keyRate;
    if (month1 <= 2 || month1 >= 20) {
      console.log('-------------- UNEXPECTED calcKeyRate  --------------');
      return keyRate;
    }

    const ratioInflation = month3 / basicInflation;

    if (ratioInflation >= 1.05) {
      console.log('------------- RAISE keyRate -------------');
      const newKeyRate = $mBasicParams(
        basicKeyRate + (month3 - basicInflation),
        0,
        0.5,
        1,
      );
      return recalculateHistory(history, newKeyRate);
    } else if (ratioInflation >= 0.95 && month1 > basicKeyRate) {
      console.log('------------ DECREASE keyRate -----------');
      const newKeyRate = $mBasicParams(
        basicKeyRate + (month3 - basicInflation),
        0,
        0.5,
        1,
      );
      return recalculateHistory(history, newKeyRate);
    }
    console.log('--------------- PRINT MONEY --------------');
    return keyRate;
  }

  private calcUnemployment(
    unemployment,
    { month3 },
    { basicUnemployment, basicInflation },
  ) {
    const { month1, history } = unemployment;
    if (month1 <= 2 || month1 >= 20) {
      console.log('-------------- UNEXPECTED calcUnemployment --------------');
      return unemployment;
    }
    const ratioKeyRate = month3 / basicUnemployment;

    if (ratioKeyRate >= 1.05) {
      console.log('------------- RAISE unemployment -------------');
      const newUnemployment = $mBasicParams(
        basicUnemployment + (month3 - basicInflation),
        0,
        0.5,
        1,
      );
      return recalculateHistory(history, newUnemployment);
    } else if (ratioKeyRate >= 0.95 && month1 > basicUnemployment) {
      console.log('------------ DECREASE unemployment -----------');
      const newUnemployment = $mBasicParams(
        basicUnemployment + (month3 - basicInflation),
        0,
        0.5,
        1,
      );
      return recalculateHistory(history, newUnemployment);
    }
    return unemployment;
  }

  public tick({ awaiting, basic, inflation, keyRate, unemployment, GDP }) {
    const { basicInflation, basicKeyRate, basicUnemployment, basicGDP } = basic;

    const bonusInflation = awaiting.inflation.shift();
    const currentInflation = basicInflation + (bonusInflation || 0);

    const newUnemployment = this.calcUnemployment(unemployment, keyRate, basic);
    const newKeyRate = this.calcKeyRate(keyRate, inflation, basic);
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
