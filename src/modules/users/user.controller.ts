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
import UserService from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { JwtAuthGuard } from '../auth/jwt/auth.guard';

@Controller('users')
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getAllPosts() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getPostById(@Param('id') id: string) {
    return this.userService.getUserById(Number(id));
  }

  @Post()
  async createPost(@Body() post: CreateUserDto) {
    return this.userService.createUser(post);
  }

  @Put(':id')
  async replacePost(@Param('id') id: string, @Body() post: UpdateUserDto) {
    return this.userService.editUser(Number(id), post);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    this.userService.deleteUser(Number(id));
  }
}
