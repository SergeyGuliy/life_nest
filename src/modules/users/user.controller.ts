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
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { JwtAuthGuard } from '../assets/auth/jwt/auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  async getUserById(@Param('userId') userId: string) {
    return await this.userService.getUserById(Number(userId));
  }

  @UseGuards(JwtAuthGuard)
  @Put(':userId')
  async editUser(@Param('userId') userId: string, @Body() user: UpdateUserDto) {
    return await this.userService.editUser(Number(userId), user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':userId')
  async changeUserTheme(
    @Param('userId') userId: string,
    @Body() user: { isDarkTheme: boolean },
  ) {
    return await this.userService.changeUserTheme(Number(userId), user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':userId')
  async deleteUser(@Param('userId') userId: string) {
    return await this.userService.deleteUser(Number(userId));
  }
}
