import {
  Controller,
  Delete,
  Get,
  Param,
  UseGuards,
  Post,
  Put,
  Inject,
} from '@nestjs/common';

import { User } from '../../assets/decorators/user.decorator.js';

import { JwtAuthGuard } from '../../assets/guards/auth/auth.guard.js';
import { CanSendFriendshipRequestGuard } from '../../assets/guards/friendships/can-send-friendship-request.guard.js';
import { IsRequestExistsGuard } from '../../assets/guards/friendships/is-request-exists.guard.js';
import { DeleteFriendshipGuard } from '../../assets/guards/friendships/delete-friendship.guard.js';
import { DeclineIfStatusGuard } from '../../assets/guards/friendships/decline-if-status.guard.js';

import { FriendshipsService } from './friendships.service.js';

@Controller('friendships')
export class FriendshipsController {
  @Inject(FriendshipsService)
  private readonly friendshipService: FriendshipsService;

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllFriendship() {
    return await this.friendshipService.getAllFriendship();
  }

  @Get('friends')
  @UseGuards(JwtAuthGuard)
  async getYourFriends(@User() user: any) {
    return await this.friendshipService.getYourFriends(+user.userId);
  }

  @Get('requests')
  @UseGuards(JwtAuthGuard)
  async getYouRequests(@User() user: any) {
    return await this.friendshipService.getYouRequests(+user.userId);
  }

  @Post(':userId/add')
  @UseGuards(JwtAuthGuard, CanSendFriendshipRequestGuard, IsRequestExistsGuard)
  async sendRequest(@Param('userId') userId: string, @User() user: any) {
    return await this.friendshipService.sendRequest(+user.userId, +userId);
  }

  @Put(':userId/accept')
  @UseGuards(
    JwtAuthGuard,
    CanSendFriendshipRequestGuard,
    DeclineIfStatusGuard('accept'),
  )
  async acceptRequest(@Param('userId') userId: string, @User() user: any) {
    return await this.friendshipService.acceptRequest(+user.userId, +userId);
  }

  @Put(':userId/ignore')
  @UseGuards(
    JwtAuthGuard,
    CanSendFriendshipRequestGuard,
    DeclineIfStatusGuard('ignore'),
  )
  async ignoreRequest(@Param('userId') userId: string, @User() user: any) {
    return await this.friendshipService.ignoreRequest(+user.userId, +userId);
  }

  @Delete(':userId/delete')
  @UseGuards(JwtAuthGuard, CanSendFriendshipRequestGuard, DeleteFriendshipGuard)
  async deleteFriendship(@Param('userId') userId: string, @User() user: any) {
    return await this.friendshipService.deleteFriendship(+user.userId, +userId);
  }
}
