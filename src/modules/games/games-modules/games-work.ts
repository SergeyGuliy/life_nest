import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Types from 'mongoose';

import {
  Game,
  GameDocument,
} from '../../../modules-helpers/entities-services/games/games.entity.js';
import { gamesWorks } from './games-works.js';
import { $mRandom, $mRoundUpper } from '../../../assets/mathjs/index.js';
import { ErrorService } from '../../../modules-helpers/global-services/error-handler.service.js';

@Injectable()
export class GamesWork {
  @InjectModel(Game.name)
  private readonly gameModel: Types.Model<GameDocument>;
  @Inject(ErrorService)
  private readonly errorService: ErrorService;

  public generate(accumulatedInflation) {
    const gamesWorksCount = gamesWorks.length - 1;
    const { workData, levels } = gamesWorks[$mRandom(0, gamesWorksCount, 0)];

    const { baseSalary, level } = levels[1];

    let { min, max } = baseSalary;
    // TODO add modifications (unemployment...)
    min = min * accumulatedInflation;
    // TODO add modifications (unemployment...)
    max = max * accumulatedInflation;
    const randomSalary = $mRandom(min, max, 0);
    // TODO add modifications (inflation, unemployment...)
    const modifiedSalary = randomSalary;
    const roundedSalary = $mRoundUpper(modifiedSalary, 5).done();

    return {
      ...workData,
      salary: roundedSalary,
      trialPeriod: 0,
      level,
    };
  }

  private getInvoice(userWork) {
    const {
      baseSalary,
      chanceSuccessfulInterview,
      interviewVisited,
      interviewPassed,
      ...invoiceData
    } = userWork;
    const { min, max } = baseSalary;

    const randomSalary = $mRandom(min, max, 0);
    const roundedSalary = $mRoundUpper(randomSalary, 5).done();

    return {
      ...invoiceData,
      salary: roundedSalary,
    };
  }

  public leaveWork = async ({ userId, gameId }) => {
    const game = await this.gameModel.findById(gameId);
    const user = game.gameData.usersData.find((i) => i.userId === userId);
    user.work = null;

    await this.gameModel.updateOne({ _id: gameId }, game);
    return user;
  };

  public async getWorksList({ userId, gameId }) {
    const game = await this.gameModel.findById(gameId);

    const dataFromCache = game.userDataCache.find(
      (i) => i.userId === userId && i.key === 'getWorksList',
    );
    if (dataFromCache) return dataFromCache.cache;

    // TODO make filtration for available works
    const availableWorks = gamesWorks.filter((i) => i);

    const accumulatedInflation = game.modifiers.inflation.accumulated;
    const workOpportunities = availableWorks.map(({ workData, levels }) => {
      const { level, baseSalary, trialPeriod } = levels[1];

      let { min, max } = baseSalary;
      // TODO add modifications (unemployment...)
      min = min * accumulatedInflation;
      // TODO add modifications (unemployment...)
      max = max * accumulatedInflation;
      // TODO make chance of a successful interview
      const chanceSuccessfulInterview = 50;

      return {
        ...workData,
        level,
        trialPeriod,
        interviewVisited: false,
        interviewPassed: false,
        baseSalary: { min, max },
        chanceSuccessfulInterview,
      };
    });

    game.userDataCache.push({
      userId,
      key: 'getWorksList',
      cache: workOpportunities,
    });
    await this.gameModel.updateOne({ _id: gameId }, game);

    return workOpportunities;
  }

  public async acceptWork({ userId, gameId, actionData }) {
    const game = await this.gameModel.findById(gameId);

    const dataFromCache = game.userDataCache.find(
      (i) => i.userId === userId && i.key === 'getWorksList',
    );
    if (!dataFromCache) {
      this.errorService.e('gameUserNotExistWork', 'en');
    }
    const work = dataFromCache.cache.find(({ key }) => key === actionData);
    if (!work) {
      this.errorService.e('gameUserNotExistWork', 'en');
    }

    const {
      baseSalary,
      chanceSuccessfulInterview,
      interviewVisited,
      interviewPassed,
      ...workData
    } = work;

    const user = game.gameData.usersData.find((i) => i.userId === userId);
    user.work = workData;

    const userDataCache = game.userDataCache.find(
      (i) => i.userId === userId && i.key === 'getWorksList',
    );
    userDataCache.cache = [];

    await this.gameModel.updateOne({ _id: gameId }, game);
    return user;
  }

  public async goToJobInterview({ userId, gameId, actionData }) {
    const game = await this.gameModel.findById(gameId);

    const dataFromCache = game.userDataCache.find(
      (i) => i.userId === userId && i.key === 'getWorksList',
    );
    if (!dataFromCache) {
      this.errorService.e('gameUserNotExistWork', 'en');
    }
    const work = dataFromCache.cache.find(({ key }) => key === actionData);
    if (!work) this.errorService.e('gameUserNotExistWork', 'en');

    const randomNumber = $mRandom(0, 100);
    const isPassInterview = work.chanceSuccessfulInterview > randomNumber;

    work.interviewVisited = true;
    work.interviewPassed = isPassInterview;

    const { min, max } = work.baseSalary;
    const randomSalary = $mRandom(min, max, 0);
    const roundedSalary = $mRoundUpper(randomSalary, 5).done();

    work.salary = roundedSalary;

    await this.gameModel.updateOne({ _id: gameId }, game);
    return dataFromCache.cache;
  }
}
