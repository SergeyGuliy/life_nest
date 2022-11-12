import { Inject, Injectable } from '@nestjs/common';

import { $mBase, $mChain } from '@assets/mathjs';
import { InjectModel } from '@nestjs/mongoose';
import {
  Game,
  GameDocument,
} from '@modules-helpers/entities-services/games/games.entity';
import { Model } from 'mongoose';
import { ErrorService } from '@modules-helpers/global-services/error-handler.service';
import { GamesTime } from '@modules/games/games-modules/games-time';

const depositDecreaseKeyRate = -20;
const depositsDuration = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

@Injectable()
export class GamesDeposits {
  @InjectModel(Game.name)
  private gameModel: Model<GameDocument>;
  @Inject(ErrorService)
  private readonly errorService: ErrorService;
  @Inject(GamesTime)
  private readonly gamesTime: GamesTime;

  private getBaseAndStep(keyRate) {
    const step = 0.1;

    let base = $mChain(keyRate).percent(depositDecreaseKeyRate).done();
    base = $mBase(base, 0, 0.1, 1);

    return { base, step };
  }

  public generate(keyRate = 0, date, oldDeposits?: any) {
    if (oldDeposits && oldDeposits?.oldKeyRate === keyRate) return oldDeposits;

    const { base, step } = this.getBaseAndStep(keyRate);

    const deposits = depositsDuration.map((duration) => {
      const stepModifiers = (12 - duration) * step;
      const percent = $mBase(base - stepModifiers, 0, 0.1, 1);
      return { duration, disabled: false, percent };
    });
    return { date, deposits, oldKeyRate: keyRate };
  }

  public async take({ userId, actionData, gameId }) {
    const game = await this.gameModel.findById(gameId);
    const user = game.gameData.usersData.find((i) => i.userId === userId);
    const { cash, deposit } = actionData;

    if (cash > user.cash) {
      this.errorService.e('gameUserNotEnoughCash', 'en');
    }

    const { percent, duration } = game.deposits.deposits.find(
      (i) => i.duration === deposit.duration,
    );
    if (percent !== deposit.percent) {
      this.errorService.e('gamesCreditsPercentNotSame', 'en');
    }
    let perMonth = $mChain(percent).divide(12).done();
    perMonth = $mChain(cash).percent(perMonth).subtract(cash).round(2).done();
    const total = $mChain(perMonth).multiply(duration).round(2).done();

    user.cash = $mChain(user.cash).subtract(cash).round(2).done();

    user.deposits.push({
      duration,
      percent,
      cash,
      perMonth,
      total,

      start: game.gameData.date,
      end: this.gamesTime.tick(game.gameData.date, duration),
    });

    await this.gameModel.updateOne({ _id: gameId }, game);
    return user;
  }
}
