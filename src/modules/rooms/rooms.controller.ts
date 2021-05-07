import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  Headers,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { JwtAuthGuard } from '../auth/jwt/auth.guard';
import { CreateRoomDto } from './dto/createRoom.dto';
import { LocalStrategy } from '../auth/strategies/local.strategy';
import { User } from '../../plugins/helpers/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('rooms')
export class RoomsController {
  constructor(
    private readonly roomsService: RoomsService,
    private readonly localStrategy: LocalStrategy,
  ) {}

  @Post('create')
  async createRoom(
    @Body() roomData: CreateRoomDto,
    @Headers() header: any,
    @User() user: any,
  ) {
    return await this.roomsService.createRoom(user.userId, roomData);
  }

  @Get()
  async getRooms(@Query() query) {
    return await this.roomsService.getRooms(query);
  }

  @Get(':roomId')
  async getRoomById(@Param('roomId') roomId: string) {
    return await this.roomsService.getRoomById(roomId);
  }

  @Delete(':roomId')
  async deleteRoom(@Param('roomId') roomId: string) {
    return await this.roomsService.deleteRoom(roomId);
  }

  @Patch('leave')
  async leaveRoom(@User() user: any) {
    return await this.roomsService.leaveRoom(user);
  }

  @Patch('join/:roomId')
  async joinRoom(
    @Param('roomId') roomId: number,
    @User() user: any,
    @Body() body: any,
  ) {
    return await this.roomsService.joinRoom(
      user.userId,
      roomId,
      body.roomPassword,
    );
  }
}
