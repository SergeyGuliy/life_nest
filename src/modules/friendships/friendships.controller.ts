import {
  Controller,
  Delete,
  Get,
  Param,
  UseGuards,
  Post,
  Put,
} from '@nestjs/common';

import { User } from '@assets/decorators/user.decorator';
import { JwtAuthGuard } from '@assets/guards/auth/auth.guard';
import { CanSendFriendshipRequestGuard } from '@assets/guards/friendships/can-send-friendship-request.guard';
import { IsRequestExistsGuard } from '@assets/guards/friendships/is-request-exists.guard';

import { FriendshipsService } from './friendships.service';

@Controller('friendships')
export class FriendshipsController {
  constructor(private readonly friendshipService: FriendshipsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllFriendship() {
    return await this.friendshipService.getAllFriendship();
  }

  @UseGuards(JwtAuthGuard)
  @Get('friends')
  async getYourFriends(@User() user: any) {
    return await this.friendshipService.getYourFriends(+user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('requests')
  async getYouRequests(@User() user: any) {
    return await this.friendshipService.getYouRequests(+user.userId);
  }

  @Post(':userId/add')
  @UseGuards(JwtAuthGuard, CanSendFriendshipRequestGuard, IsRequestExistsGuard)
  async sendRequest(@Param('userId') userId: string, @User() user: any) {
    return await this.friendshipService.sendRequest(+user.userId, +userId);
  }

  @Put(':userId/accept')
  @UseGuards(JwtAuthGuard, CanSendFriendshipRequestGuard)
  async acceptRequest(@Param('userId') userId: string, @User() user: any) {
    return await this.friendshipService.acceptRequest(+user.userId, +userId);
  }

  @Put(':userId/ignore')
  @UseGuards(JwtAuthGuard, CanSendFriendshipRequestGuard)
  async ignoreRequest(@Param('userId') userId: string, @User() user: any) {
    return await this.friendshipService.ignoreRequest(+user.userId, +userId);
  }

  @Delete(':userId/delete')
  @UseGuards(JwtAuthGuard, CanSendFriendshipRequestGuard)
  async deleteFriendship(@Param('userId') userId: string, @User() user: any) {
    return await this.friendshipService.deleteFriendship(+user.userId, +userId);
  }
}
