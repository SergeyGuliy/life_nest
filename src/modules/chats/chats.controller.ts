import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/auth.guard';
import { User } from '../../plugins/helpers/decorators/user.decorator';
import { ChatsService } from './chats.service';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';

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
