import { Injectable } from '@nestjs/common';

// import { RoomsSocketGateway } from './game.gateway';
//
// import { RoomsManagerService } from '../../sub_modules/entitiesManagers/rooms/rooms.service';
// import { UserManagerService } from '../../sub_modules/entitiesManagers/users/user.service';
// import { ErrorHandlerService } from '../../sub_modules/globalServices/error-handler.service';

import { Game, GameDocument } from './game.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class GameService {
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
