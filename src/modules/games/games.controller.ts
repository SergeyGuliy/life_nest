import {
  Controller,
  Get,
  Post,
  // Delete,
  Param,
  Body,
  // Query,
  UseGuards,
  Inject,
  // Patch,
} from '@nestjs/common';

import { GamesService } from './games.service';
import { JwtAuthGuard } from '@assets/guards/auth/auth.guard';
import { User } from '@assets/decorators/user.decorator';
import { GamesCryptos } from '@modules/games/games-modules/games-cryptos';
import { GamesWork } from '@modules/games/games-modules/games-work';
import { GamesCredits } from '@modules/games/games-modules/games-credits';
import { GamesDeposits } from '@modules/games/games-modules/games-deposits';

@Controller('games')
export class GamesController {
  @Inject(GamesService)
  private readonly gameService: GamesService;
  @Inject(GamesCryptos)
  private readonly gamesCryptos: GamesCryptos;
  @Inject(GamesWork)
  private readonly gamesWork: GamesWork;
  @Inject(GamesCredits)
  private readonly gamesCredits: GamesCredits;
  @Inject(GamesDeposits)
  private readonly gamesDeposits: GamesDeposits;

  @Post('start')
  @UseGuards(JwtAuthGuard)
  async startGame(@Body() { gameSettings, roomId }) {
    return this.gameService.startGame(roomId, gameSettings);
  }

  @Get(':gameId')
  @UseGuards(JwtAuthGuard)
  async getGameById(@Param('gameId') gameId: string) {
    return this.gameService.getGameById(gameId);
  }

  @Get('user-data/:gameId')
  @UseGuards(JwtAuthGuard)
  async getUserData(@Param('gameId') gameId: string, @User() { userId }) {
    return this.gameService.getUserData(gameId, userId);
  }

  @Post('user-action/')
  @UseGuards(JwtAuthGuard)
  async userAction(
    @Body() { actionModule, actionMethod, actionData, gameId },
    @User() { userId },
  ) {
    return this[actionModule][actionMethod]({
      actionData,
      userId,
      gameId,
    });
  }
}
