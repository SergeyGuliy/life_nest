import { Injectable } from '@nestjs/common';

@Injectable()
export class GamesExpenses {
  public generate(accumulatedInflation) {
    const fff = {
      base: {
        productsFood: 200,
        clothingAccessories: 100,
        cosmeticsMedicine: 50,
        communalPayments: 100,
        rentalProperty: 0,
        petrolService: 0,
        relaxationTourism: 40,
        other: 100,
      },
      actual: {},
    };

    return fff;
  }
}
