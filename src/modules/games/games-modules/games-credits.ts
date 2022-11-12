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

const creditDecreaseKeyRate = -20;
const creditsDuration = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

@Injectable()
export class GamesCredits {
  @InjectModel(Game.name)
  private gameModel: Model<GameDocument>;
  @Inject(ErrorService)
  private readonly errorService: ErrorService;
  @Inject(GamesTime)
  private readonly gamesTime: GamesTime;

  private getBaseAndStep(keyRate) {
    const step = 0.1;

    let base = $mChain(keyRate).percent(creditDecreaseKeyRate).done();
    base = $mBase(base, 0, 0.1, 1);

    return { base, step };
  }

  public generate(keyRate = 0, date, oldCredits?: any) {
    if (oldCredits && oldCredits?.oldKeyRate === keyRate) {
      return oldCredits;
    }
    const { base, step } = this.getBaseAndStep(keyRate);

    const credits = creditsDuration.map((duration) => {
      const stepModifiers = (12 - duration) * step;
      const calculatedPercent = $mBase(base - stepModifiers, 0, 0.1, 1);

      return {
        duration,
        disabled: false,
        percent: calculatedPercent,
      };
    });
    return {
      lastRecalculation: date,
      credits,
      oldKeyRate: keyRate,
    };
  }

  public async takeCredit({ userId, actionData, gameId }) {
    const game = await this.gameModel.findById(gameId);
    const user = game.gameData.usersData.find((i) => i.userId === userId);

    const { cashCount, credit } = actionData;

    if (cashCount > user.cash) {
      this.errorService.e('gameUserNotEnoughCash', 'en');
    }

    const creditServer = game.credits.credits.find(
      ({ duration }) => duration === credit.duration,
    );
    if (creditServer.percent !== credit.percent) {
      this.errorService.e('gamesCreditsPercentNotSame', 'en');
    }
    const monthPercent = $mChain(creditServer.percent).divide(12).done();
    const incomePerMonth = $mChain(cashCount)
      .percent(monthPercent)
      .subtract(cashCount)
      .round(2)
      .done();
    const incomeTotal = $mChain(incomePerMonth)
      .multiply(creditServer.duration)
      .round(2)
      .done();

    user.cash = $mChain(user.cash).subtract(cashCount).round(2).done();

    user.credits.push({
      duration: creditServer.duration,
      percent: creditServer.percent,
      creditStart: game.gameData.date,
      cashCount,
      incomePerMonth,
      incomeTotal,
      creditEnd: this.gamesTime.tick(game.gameData.date, creditServer.duration),
    });

    await this.gameModel.updateOne({ _id: gameId }, game);
    return user;
  }
}
