import { Controller, Delete, UseGuards } from '@nestjs/common';
import { SqlHelperService } from './sql-helper.service';
import { JwtAuthGuard } from '../auth/jwt/auth.guard';

@Controller('sql-controller')
export class SqlHelperController {
  constructor(private readonly sqlHelperService: SqlHelperService) {}

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteAllUser() {
    return await this.sqlHelperService.deleteAllUser();
  }
}
