// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { Injectable } from '@nestjs/common';
import { create, all } from 'mathjs';

const math = create(all);

function percent(original, percent) {
  const coefficient = (percent + 100) / 100;
  return original * coefficient;
}
percent.transform = (a, b) => percent(a, b);
math.import({
  percent,
});

const example = math.chain(100).percent(-5).percent(5).done();

console.log(`example = ${example}`);

@Injectable()
export class MathService {
  private readonly math = math;
}
