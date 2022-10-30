import {
  Controller,
  Get,
  Post,
  // Delete,
  Param,
  Body,
  // Query,
  UseGuards,
  // Patch,
} from '@nestjs/common';

import { GamesService } from './games.service';
import { JwtAuthGuard } from '@assets/guards/auth/auth.guard';
import { User } from '@assets/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('games')
export class GamesController {
  constructor(private readonly gameService: GamesService) {}

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

  @Get(':gameId')
  @UseGuards(JwtAuthGuard)
  async getGameUserData(@Param('gameId') gameId: string, @User() { userId }) {
    return this.gameService.getGameUserData(gameId, userId);
  }
}
