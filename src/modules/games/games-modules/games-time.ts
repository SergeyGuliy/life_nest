import { Injectable } from '@nestjs/common';
import * as moment from 'moment/moment';

@Injectable()
export class GamesTime {
  public generate(dateProp = null) {
    const date = dateProp ? moment(dateProp) : moment();
    const month = date.month();
    const monthCode = date.format('MMM');
    const year = date.year();
    return {
      date,
      month,
      monthCode,
      year,
    };
  }

  public tick(date, countMonth = 1) {
    const dateWithAddedMonth = moment(date.date).add(countMonth, 'M');
    return this.generate(dateWithAddedMonth);
  }

  public checkEndGame() {
    // add checker is game ended
  }
}
