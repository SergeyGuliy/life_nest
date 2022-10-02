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
  Inject,
} from '@nestjs/common';

import { RoomsService } from './rooms.service';
import { JwtAuthGuard } from '@assets/guards/auth/auth.guard';
import { CreateRoomDto } from '@assets/dto/createRoom.dto';
import { User } from '@assets/decorators/user.decorator';

import { IsRoomAdminGuard } from '@assets/guards/rooms/is-room-admin.guard';
import { RoomBlockedGuard } from '@assets/guards/rooms/is-room-blocked.guard';
import { PasswordGuard } from '@assets/guards/rooms/password-validation.guard';
import { CountOfUsersValidationGuard } from '@assets/guards/rooms/count-of-users-validation.guard';

@UseGuards(JwtAuthGuard)
@Controller('rooms')
export class RoomsController {
  @Inject(RoomsService)
  private readonly roomsService: RoomsService;

  @Post('create')
  async createRoom(@Body() roomData: CreateRoomDto, @User() user: any) {
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

  @Patch('leave')
  async userLeaveRoom(@User() user: any) {
    return await this.roomsService.userLeaveRoom(user);
  }

  @Patch(':roomId/join')
  @UseGuards(RoomBlockedGuard, PasswordGuard, CountOfUsersValidationGuard)
  async userJoinRoom(@Param('roomId') roomId: number, @User() user: any) {
    return await this.roomsService.userJoinRoom(user.userId, roomId);
  }

  @Patch(':roomId/kick-user')
  @UseGuards(IsRoomAdminGuard)
  async kickUserFromRoom(
    @Param('roomId') roomId: number,
    @User() { userId },
    @Body() { kickUserId },
  ) {
    return await this.roomsService.kickUserFromRoomRequest(
      userId,
      roomId,
      kickUserId,
    );
  }

  @Patch(':roomId/set-new-admin')
  @UseGuards(IsRoomAdminGuard)
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

  @Patch(':roomId/toggle-lock-room')
  @UseGuards(IsRoomAdminGuard)
  async toggleLockRoom(
    @Param('roomId') roomId: number,
    @User() { userId },
    @Body() { lockState },
  ) {
    return await this.roomsService.toggleLockRoom(+userId, +roomId, lockState);
  }

  @Delete(':roomId/delete-room')
  @UseGuards(IsRoomAdminGuard)
  async deleteRoom(@Param('roomId') roomId: number, @User() { userId }) {
    return await this.roomsService.deleteRoomRequest(+userId, +roomId);
  }
}
