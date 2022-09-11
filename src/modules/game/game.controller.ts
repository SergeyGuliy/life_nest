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
@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('create')
  async startGame(@Body() gameData: any, @Body() roomId: any) {
    return this.gameService.startGame(roomId, gameData);
  }

  @Get(':roomId')
  async getGameById(@Param('gameId') gameId: string) {
    return this.gameService.getGameById(gameId);
  }
}
