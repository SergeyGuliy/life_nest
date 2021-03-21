import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Put,
  Body,
  Head,
  Header,
  Headers,
  UseGuards,
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

  @Post()
  async createRoom(
    @Body() roomData: CreateRoomDto,
    @Headers() header: any,
    @User() user: any,
  ) {
    return await this.roomsService.createRoom({
      ...roomData,
      creatorId: user.userId,
    });
  }

  @Get()
  async getRooms() {
    return await this.roomsService.getRooms();
  }

  @Get(':roomId')
  async getRoomById(@Param('roomId') roomId: string) {
    return await this.roomsService.getRoomById(roomId);
  }
}
