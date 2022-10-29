import { Injectable } from '@nestjs/common';
import * as moment from 'moment/moment';

@Injectable()
export class GamesTime {
  public getDate(dateProp = moment()) {
    const date = moment(dateProp);
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

  public incrementMonth(dateProp = moment()) {
    const dateWithAddedMonth = moment(dateProp).add(1, 'M');
    return this.getDate(dateWithAddedMonth);
  }

  public checkEndGame() {
    // add checker is game ended
  }
}