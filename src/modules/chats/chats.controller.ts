import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/auth.guard';
import { User } from '../../plugins/helpers/decorators/user.decorator';
import { ChatsService } from './chats.service';

@UseGuards(JwtAuthGuard)
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

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
