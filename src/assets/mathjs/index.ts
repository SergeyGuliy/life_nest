import { create, all } from 'mathjs';

import { customFunctions } from '@assets/mathjs/custom-functions';
declare module 'mathjs' {
  interface MathJsChain<TValue> {
    percent(this: any, n?: any): any;
  }
}
const $math = create(all);
$math.import(customFunctions);

const ROUND = 2;

const $mMethods = {
  $mRandom(min, max) {
    return $math.round($math.random(min, max), ROUND);
  },
  $mChain(val) {
    return $math.chain(val);
  },
};

export { $math, $mMethods };
