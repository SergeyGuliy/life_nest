import { Injectable } from '@nestjs/common';
import { mathjs } from '@assets/mathjs/index';
declare module 'mathjs' {
  interface MathJsChain<TValue> {
    percent(this: any, n?: any): any;
  }
}
const example = mathjs.chain(100).percent(-5).percent(5).done();

console.log(`example = ${example}`);

@Injectable()
export class MathService {
  // private readonly mathjs = mathjs;

  public chain(initValue) {
    return mathjs.chain(initValue);
  }
  public random(min, max) {
    return mathjs.round(mathjs.random(min, max), 2);
  }
}
