import { Injectable } from '@nestjs/common';
import { $mBase } from '@assets/mathjs';

function generateBasic(price) {
  return +$mBase(price, price / 20, 1);
}

@Injectable()
export class GamesExpenses {
  public generate(accumulatedInflation) {
    const generatedExpenses = {
      base: {
        productsFood: generateBasic(200),
        clothingAccessories: generateBasic(100),
        cosmeticsMedicine: generateBasic(50),
        communalPayments: generateBasic(100),
        relaxationTourism: generateBasic(50),
        other: generateBasic(100),
        // rentalProperty: 0,
        // petrolService: 0,
      },
      actual: {},
    };

    return this.tick(generatedExpenses, accumulatedInflation);
  }

  public tick(expenses, accumulatedInflation) {
    Object.entries(expenses.base).forEach(([key, val]) => {
      const valWithInflation = +val * accumulatedInflation;
      expenses.actual[key] = +$mBase(valWithInflation, 0, 0.01, 2);
    });

    return expenses;
  }
}
