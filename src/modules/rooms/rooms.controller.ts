import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Patch,
} from '@nestjs/common';

import { RoomsService } from './rooms.service';
import { JwtAuthGuard } from '../../assets/guards/auth.guard';
import { CreateRoomDto } from '../../assets/dto/createRoom.dto';
import { User } from '../../assets/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post('create')
  async createRoom(@Body() roomData: CreateRoomDto, @User() user: any) {
    return await this.roomsService.createRoom(user.userId, roomData);
  }

  @Get()
  async getRooms(@Query() query) {
    console.log(query);
    return await this.roomsService.getRooms(query);
  }

  @Get(':roomId')
  async getRoomById(@Param('roomId') roomId: string) {
    return await this.roomsService.getRoomById(roomId);
  }

  @Patch('leave')
  async userLeaveRoom(@User() user: any) {
    return await this.roomsService.userLeaveRoom(user);
  }

  @Patch(':roomId/join')
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

  @Patch(':roomId/kick-user')
  async kickUserFromRoom(
    @Param('roomId') roomId: number,
    @User() { userId },
    @Body() { kickUserId },
  ) {
    return await this.roomsService.kickUserFromRoom(userId, roomId, kickUserId);
  }

  @Patch(':roomId/set-new-admin')
  async setNewRoomAdmin(
    @Param('roomId') roomId: number,
    @User() { userId },
    @Body() { newAdminId },
  ) {
    return await this.roomsService.setNewRoomAdmin(
      +userId,
      +roomId,
      +newAdminId,
    );
  }

  @Patch(':roomId/block-room')
  async blockRoom(@Param('roomId') roomId: number, @User() { userId }) {
    return await this.roomsService.blockRoom(+userId, +roomId);
  }

  @Delete(':roomId/delete-room')
  async deleteRoom(@Param('roomId') roomId: number, @User() { userId }) {
    return await this.roomsService.deleteRoomRequest(+userId, +roomId);
  }
}
