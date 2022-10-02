import { Controller, Get, Inject, UseGuards } from '@nestjs/common';

import { User } from '@assets/decorators/user.decorator';
import { JwtAuthGuard } from '@assets/guards/auth/auth.guard';
import { ChatsService } from './chats.service';

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatsController {
  @Inject(ChatsService)
  private readonly chatsService: ChatsService;

  @Get('global')
  async getAllGlobalMessages() {
    return await this.chatsService.getAllGlobalMessages();
  }

  @Get('room')
  async getRooms(@User() user: any) {
    return await this.chatsService.getAllRoomMessages(user.roomJoinedId);
  }

  @Get('private')
  async getRoomById(@User() user: any) {
    return await this.chatsService.getAllPrivateMessages(user.userId);
  }
}
