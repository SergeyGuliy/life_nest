import { Injectable } from '@nestjs/common';

import { UpdateUserDto } from '../../plugins/dto/updateUser.dto';
import { UserManagerService } from '../../assets/entitiesManagers/users/user.service';

@Injectable()
export class UserService {
  constructor(private readonly userManagerService: UserManagerService) {}

  async getAllUsers() {
    return await this.userManagerService.getAllUsers();
  }

  async getUserById(userId: number) {
    return await this.userManagerService.getUserById(userId);
  }

  async editUser(userId: number, user: UpdateUserDto) {
    return this.userManagerService.editUser(userId, user);
  }

  async changeUserTheme(userId: number, { isDarkTheme }) {
    return this.userManagerService.changeUserTheme(userId, { isDarkTheme });
  }

  async deleteUser(userId: number) {
    return this.userManagerService.deleteUser(userId);
  }
}
