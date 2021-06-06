import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  UseGuards,
  Post,
  Put,
} from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { JwtAuthGuard } from '../assets/auth/jwt/auth.guard';
import { User } from '../../plugins/helpers/decorators/user.decorator';

@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers() {
    return await this.friendshipService.getAllFriendship();
  }

  @UseGuards(JwtAuthGuard)
  @Post('add/:userId')
  async userSendFriendshipRequest(
    @Param('userId') userId: string,
    @Body() user: { userId: string },
  ) {
    return await this.friendshipService.userSendFriendshipRequest(
      Number(userId),
      userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('accept/:userId')
  async userAcceptFriendshipRequest(
    @Param('userId') userId: string,
    @Body() user: { userId: string },
  ) {
    return await this.friendshipService.userAcceptFriendshipRequest(
      Number(userId),
      userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('decline/:userId')
  async userDeclineFriendshipRequest(
    @Param('userId') userId: string,
    @Body() user: { userId: string },
  ) {
    return await this.friendshipService.userDeclineFriendshipRequest(
      Number(userId),
      userId,
    );
  }
}
