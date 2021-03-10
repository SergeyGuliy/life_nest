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
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return await this.userService.getUserById(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createUser(@Body() post) {
    return await this.userService.createUser(post);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async editUser(@Param('id') id: string, @Body() post: UpdateUserDto) {
    return await this.userService.editUser(Number(id), post);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async changeUserTheme(
    @Param('id') id: string,
    @Body() post: { isDarkTheme: boolean },
  ) {
    return await this.userService.changeUserTheme(Number(id), post);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return await this.userService.deleteUser(Number(id));
  }
}
