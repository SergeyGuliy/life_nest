import { Controller, Get, Param, UseGuards, Inject } from '@nestjs/common';

import { UserService } from './user.service.js';
import { JwtAuthGuard } from '../../assets/guards/auth/auth.guard.js';
import { IsUserExistGuard } from '../../assets/guards/users/is-user-exist.guard.js';

@Controller('users')
export class UserController {
  @Inject(UserService)
  private readonly userService: UserService;

  @Get(':userId')
  @UseGuards(JwtAuthGuard, IsUserExistGuard)
  async getUserById(@Param('userId') userId: string) {
    return await this.userService.getUserById(Number(userId));
  }
}
