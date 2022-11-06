import { create, all, multiply, add, round, divide } from 'mathjs';

import { customFunctions } from '@assets/mathjs/custom-functions';
declare module 'mathjs' {
  interface MathJsChain<TValue> {
    percent(this: any, n?: any): any;
  }
}
const $m = create(all);
$m.import(customFunctions);

const ROUND = 2;

function $mRandom(min, max, round = ROUND) {
  return $m.round($m.random(min, max), round);
}
function $mChain(val) {
  return $m.chain(val);
}

function $mMedian([median1, count1], [median2, count2]) {
  const fullPrice1 = multiply(median1, count1);
  const fullPrice2 = multiply(median2, count2);
  const fullPrice = add(fullPrice1, fullPrice2);

  const newCount = round(add(count1, count2), 2);
  const newMedian = round(+divide(fullPrice, newCount), 2);

  return [newMedian, newCount];
}

export { $m, $mRandom, $mChain, $mMedian };
