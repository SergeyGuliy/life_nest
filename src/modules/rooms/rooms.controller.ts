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
import { JwtAuthGuard } from '../assets/auth/jwt/auth.guard';
import { CreateRoomDto } from './dto/createRoom.dto';
import { User } from '../../plugins/helpers/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

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
  async userLeaveRoom(@User() user: any) {
    return await this.roomsService.userLeaveRoom(user);
  }

  @Patch('join/:roomId')
  async userJoinRoom(
    @Param('roomId') roomId: number,
    @User() user: any,
    @Body() body: any,
  ) {
    return await this.roomsService.userJoinRoom(
      user.userId,
      roomId,
      body.roomPassword,
    );
  }
}
