import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Types from 'mongoose';

import {
  Game,
  GameDocument,
} from '../../../modules-helpers/entities-services/games/games.entity.js';
import { $mBase, $mChain } from '../../../assets/mathjs/index.js';
import { ErrorService } from '../../../modules-helpers/global-services/error-handler.service.js';
import { GamesTime } from './games-time.js';

const creditIncrementKeyRate = 20;
const creditsDuration = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

@Injectable()
export class GamesCredits {
  @InjectModel(Game.name)
  private gameModel: Types.Model<GameDocument>;
  @Inject(ErrorService)
  private readonly errorService: ErrorService;
  @Inject(GamesTime)
  private readonly gamesTime: GamesTime;

  private getBaseAndStep(keyRate) {
    const step = 0.1;

    let base = $mChain(keyRate).percent(creditIncrementKeyRate).done();
    base = $mBase(base, 0, 0.1, 1);

    return { base, step };
  }

  public generate(keyRate = 0, date, oldCredits?: any) {
    if (oldCredits && oldCredits?.oldKeyRate === keyRate) return oldCredits;

    const { base, step } = this.getBaseAndStep(keyRate);

    const credits = creditsDuration.map((duration) => {
      const stepModifiers = (12 - duration) * step;
      const percent = $mBase(base - stepModifiers, 0, 0.1, 1);
      return { duration, disabled: false, percent };
    });
    return { date, credits, oldKeyRate: keyRate };
  }

  public async take({ userId, actionData, gameId }) {
    const game = await this.gameModel.findById(gameId);
    const user = game.gameData.usersData.find((i) => i.userId === userId);
    const { cash, credit } = actionData;

    if (false) {
      // TODO Check can user pay for credit
      // this.errorService.e('gameUserNotEnoughCash', 'en');
    }
    if (false) {
      // TODO Check credit history
      // this.errorService.e('gameUserNotEnoughCash', 'en');
    }

    const { duration, percent } = game.credits.credits.find(
      ({ duration }) => duration === credit.duration,
    );
    if (percent !== credit.percent) {
      this.errorService.e('gamesCreditsPercentNotSame', 'en');
    }
    let perMonth = $mChain(percent).divide(12).done();
    perMonth = $mChain(cash).percent(perMonth).subtract(cash).round(2).done();
    const total = $mChain(perMonth).multiply(duration).round(2).done();

    user.cash = $mChain(user.cash).add(cash).round(2).done();

    user.credits.push({
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
