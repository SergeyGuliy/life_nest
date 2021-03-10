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
import { JwtAuthGuard } from '../auth/jwt/auth.guard';

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
  @Post()
  async createUser(@Body() post) {
    return await this.userService.createUser(post);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':userId')
  async editUser(@Param('userId') userId: string, @Body() post: UpdateUserDto) {
    return await this.userService.editUser(Number(userId), post);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':userId')
  async changeUserTheme(
    @Param('userId') userId: string,
    @Body() post: { isDarkTheme: boolean },
  ) {
    return await this.userService.changeUserTheme(Number(userId), post);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':userId')
  async deleteUser(@Param('userId') userId: string) {
    return await this.userService.deleteUser(Number(userId));
  }
}
