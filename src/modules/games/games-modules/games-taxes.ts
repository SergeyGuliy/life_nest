import { Injectable } from '@nestjs/common';
import { $mBase } from '@assets/mathjs';

const economicSectors = {
  informationTechnology: 'informationTechnology', // компаний, которые разрабатывают или распространяют технологические товары или услуги, а также интернет-компании.
  healthCare: 'healthCare', // компаний по поставке медицинских товаров, фармацевтических компаний и научно обоснованных операций или услуг, направленных на улучшение человеческого тела или разума
  financials: 'financials', // компании, занимающиеся финансами, инвестированием, движением или хранением дене
  consumerDiscretionary: 'consumerDiscretionary', // это предметы роскоши или услуги, которые не являются необходимыми для выживания
  communicationServices: 'communicationServices', // Которые поддерживают связь между людьми
  industrials: 'industrials', // Компаний, от авиакомпаний и железнодорожных компаний до производителей военного оружия
  consumerStaples: 'consumerStaples', // Компании по производству потребительских товаров обеспечивают все необходимое для жизни
  energy: 'energy', // компаний, которые участвуют в бизнесе нефти, газа и потребляемых видов топлив
  utilities: 'utilities', // Коммунальные предприятия обеспечивают или производят электроэнергию, воду и газ для зданий и домашних хозяйств
  realEstate: 'realEstate', // инвестиционные фонды недвижимости (REIT), а также риэлторские и другие компании.
  materials: 'materials', // Компании в секторе материалов обеспечивают сырье, необходимое для функционирования других секторов
};

@Injectable()
export class GamesTaxes {
  public generate() {
    return {
      salary: 10,
      deposits: 10,
      cryptosShares: 10,
      sector: Object.entries(economicSectors).map((key: any) => ({
        [key]: $mBase(10, 2, 0.5, 1),
      })),
    };
  }
}
