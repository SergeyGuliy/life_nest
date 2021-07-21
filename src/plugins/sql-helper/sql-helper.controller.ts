import { Controller, Delete, UseGuards } from '@nestjs/common';
import { SqlHelperService } from './sql-helper.service';
import { JwtAuthGuard } from '../../modules/assets/auth/jwt/auth.guard';

@Controller('sql-controller')
export class SqlHelperController {
  constructor(private readonly sqlHelperService: SqlHelperService) {}

  @UseGuards(JwtAuthGuard)
  @Delete('users')
  async deleteAllUser() {
    return await this.sqlHelperService.deleteAllUser();
  }

  @UseGuards(JwtAuthGuard)
  @Delete('rooms')
  async deleteAllRooms() {
    return await this.sqlHelperService.deleteAllRooms();
  }

  @UseGuards(JwtAuthGuard)
  @Delete('messages')
  async deleteAllMessages() {
    return await this.sqlHelperService.deleteAllMessages();
  }

  @UseGuards(JwtAuthGuard)
  @Delete('friendship')
  async deleteAllFriendship() {
    return await this.sqlHelperService.deleteAllFriendship();
  }
}
