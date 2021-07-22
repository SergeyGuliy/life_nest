import {
  Controller,
  Delete,
  Get,
  Param,
  UseGuards,
  Post,
  Put,
} from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { JwtAuthGuard } from '../auth/jwt/auth.guard';
import { User } from '../../plugins/decorators/user.decorator';

@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers() {
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
