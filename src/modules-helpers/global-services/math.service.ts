// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Injectable } from '@nestjs/common';
import { mathjs } from '@assets/mathjs/index';

const example = mathjs.chain(100).percent(-5).percent(5).done();

console.log(`example = ${example}`);

@Injectable()
export class MathService {
  private readonly mathjs = mathjs;

  public chain(initValue) {
    return this.mathjs.chain(initValue);
  }
}
