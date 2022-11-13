import { Injectable } from '@nestjs/common';

@Injectable()
export class GamesExpenses {
  public generate() {
    return {
      productsFood: 100,
      clothingAccessories: 100,
      cosmeticsMedicine: 100,
      communalPayments: 100,
      rentalProperty: 100,
      petrolService: 100,
      relaxationTourism: 100,
      other: 100,
    };
  }
}
