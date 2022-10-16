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

@UseGuards(JwtAuthGuard)
@Controller('games')
export class GamesController {
  constructor(private readonly gameService: GamesService) {}

  @Post('start')
  async startGame(@Body() { gameSettings, roomId }) {
    return this.gameService.startGame(roomId, gameSettings);
  }

  @Get(':gameId')
  async getGameById(@Param('gameId') gameId: string) {
    return this.gameService.getGameById(gameId);
  }
}
