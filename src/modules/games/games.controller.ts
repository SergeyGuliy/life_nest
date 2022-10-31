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

@Controller('games')
export class GamesController {
  @Inject(GamesService)
  private readonly gameService: GamesService;
  @Inject(GamesCryptos)
  private readonly gamesCryptos: GamesCryptos;

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
  async getInGameUserData(@Param('gameId') gameId: string, @User() { userId }) {
    return this.gameService.getInGameUserData(gameId, userId);
  }

  @Post('crypto/get/')
  @UseGuards(JwtAuthGuard)
  async getCryptoHistory(@Body() body) {
    return this.gamesCryptos.getCryptoHistory(body);
  }
}
