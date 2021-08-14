import {
  Controller,
  Delete,
  Get,
  Param,
  UseGuards,
  Post,
  Put,
} from '@nestjs/common';

import { User } from '../../assets/decorators/user.decorator';
import { JwtAuthGuard } from '../../assets/guards/auth.guard';
import { FriendshipService } from './friendship.service';

@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

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

  @UseGuards(JwtAuthGuard)
  @Post('add/:userId')
  async sendRequest(@Param('userId') userId: string, @User() user: any) {
    return await this.friendshipService.sendRequest(+user.userId, +userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('accept/:userId')
  async acceptRequest(@Param('userId') userId: string, @User() user: any) {
    return await this.friendshipService.acceptRequest(+user.userId, +userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('ignore/:userId')
  async ignoreRequest(@Param('userId') userId: string, @User() user: any) {
    return await this.friendshipService.ignoreRequest(+user.userId, +userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:userId')
  async deleteFriendship(@Param('userId') userId: string, @User() user: any) {
    return await this.friendshipService.deleteFriendship(+user.userId, +userId);
  }
}
