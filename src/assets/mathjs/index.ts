import { create, all, multiply, add, round, divide } from 'mathjs';

import { customFunctions } from '@assets/mathjs/custom-functions';
declare module 'mathjs' {
  interface MathJsChain<TValue> {
    percent(this: any, n?: any): any;
  }
}
const $math = create(all);
$math.import(customFunctions);

const ROUND = 2;

function $mRandom(min, max, round = ROUND) {
  return $math.round($math.random(min, max), round);
}
function $mChain(val) {
  return $math.chain(val);
}

function $mMedian([median1, count1], [median2, count2]) {
  const fullPrice1 = multiply(median1, count1);
  const fullPrice2 = multiply(median2, count2);
  const fullPrice = add(fullPrice1, fullPrice2);

  const newCount = round(add(count1, count2), 2);
  const newMedian = round(+divide(fullPrice, newCount), 2);

  return [newMedian, newCount];
}

export { $math, $mRandom, $mChain, $mMedian };
