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
import { FriendshipsService } from './friendships.service';
import { CanSendFriendshipRequestGuard } from '@assets/guards/friendships/can-send-friendship-request.guard';

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

  @UseGuards(JwtAuthGuard, CanSendFriendshipRequestGuard)
  @Post(':userId/add')
  async sendRequest(@Param('userId') userId: string, @User() user: any) {
    return await this.friendshipService.sendRequest(+user.userId, +userId);
  }

  @UseGuards(JwtAuthGuard, CanSendFriendshipRequestGuard)
  @Put(':userId/accept')
  async acceptRequest(@Param('userId') userId: string, @User() user: any) {
    return await this.friendshipService.acceptRequest(+user.userId, +userId);
  }

  @UseGuards(JwtAuthGuard, CanSendFriendshipRequestGuard)
  @Put(':userId/ignore')
  async ignoreRequest(@Param('userId') userId: string, @User() user: any) {
    return await this.friendshipService.ignoreRequest(+user.userId, +userId);
  }

  @UseGuards(JwtAuthGuard, CanSendFriendshipRequestGuard)
  @Delete(':userId/delete')
  async deleteFriendship(@Param('userId') userId: string, @User() user: any) {
    return await this.friendshipService.deleteFriendship(+user.userId, +userId);
  }
}
