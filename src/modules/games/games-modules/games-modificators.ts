import { Injectable } from '@nestjs/common';

const modifiers = {
  grossDomesticProduct: 2,
  unemployment: 2,
  keyRate: 2,
  inflation: {
    accumulated: 1,
    month1: 1,
    month3: 1,
    month6: 1,
    month12: 1,
    history: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  },
};

@Injectable()
export class GamesModifiers {
  public generate() {
    return modifiers;
  }
}
