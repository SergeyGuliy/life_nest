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

import { GameService } from './game.service';
import { JwtAuthGuard } from '../../assets/guards/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('create')
  async createGame(@Body() gameData: any, @Body() roomId: any) {
    return this.gameService.createGame(roomId, gameData);
  }

  @Get(':roomId')
  async getGameById(@Param('gameId') gameId: string) {
    return this.gameService.getGameById(gameId);
  }
}
