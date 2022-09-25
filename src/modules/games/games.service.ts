import { Injectable } from '@nestjs/common';
import {
  Game,
  GameDocument,
} from '@modules-helpers/entities-services/games/games.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class GamesService {
  constructor(
    @InjectModel(Game.name) private gameModel: Model<GameDocument>, // private readonly errorHandlerService: ErrorHandlerService, // private readonly roomsSocketGateway: RoomsSocketGateway, // private readonly roomsManagerService: RoomsManagerService, // private readonly userManagerService: UserManagerService,
  ) {}

  getGameById(gameData) {
    console.log('getGameById');
    console.log(gameData);
  }

  async startGame(roomId, gameData) {
    console.log('createGame');
    console.log(roomId);
    console.log(gameData);

    const createdGame = new this.gameModel({
      name: 'name',
      age: 11,
      breed: 'breed',
    });
    return {
      game: await createdGame.save(),
    };
  }
}
