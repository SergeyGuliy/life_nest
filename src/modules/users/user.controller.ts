import {
  Body,
  Controller,
  Get,
  Param,
  UseGuards,
  Put,
  Inject,
} from '@nestjs/common';

import { UserService } from './user.service';
import { UpdateUserDto } from '@assets/dto/updateUser.dto';
import { JwtAuthGuard } from '@assets/guards/auth/auth.guard';
import { IsUserExistGuard } from '@assets/guards/users/is-user-exist.guard';

@Controller('users')
export class UserController {
  @Inject(UserService)
  private readonly userService: UserService;

  @Get(':userId')
  @UseGuards(JwtAuthGuard, IsUserExistGuard)
  async getUserById(@Param('userId') userId: string) {
    return await this.userService.getUserById(Number(userId));
  }

  @Put(':userId')
  @UseGuards(JwtAuthGuard)
  async editUser(@Param('userId') userId: string, @Body() user: UpdateUserDto) {
    return await this.userService.editUser(Number(userId), user);
  }

  @Put(':userId')
  @UseGuards(JwtAuthGuard)
  async changeUserTheme(
    @Param('userId') userId: string,
    @Body() user: { isDarkTheme: boolean },
  ) {
    return await this.userService.changeUserTheme(Number(userId), user);
  }
}
