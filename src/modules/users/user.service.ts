import { Injectable } from '@nestjs/common';

import { UserManagerService } from '../../sub_modules/entitiesManagers/users/user.service';

@Injectable()
export class UserService {
  constructor(private readonly userManagerService: UserManagerService) {}

  async getAllUsers() {
    return await this.userManagerService.find();
  }

  async getUserById(userId: number) {
    await this.userManagerService.catchUserNotExists(userId);
    return await this.userManagerService.findOne(userId);
  }

  async editUser(userId: number, user) {
    await this.userManagerService.catchUserNotExists(userId);
    await this.userManagerService.update(userId, user);
    return await this.userManagerService.findOne(userId);
  }

  async changeUserTheme(userId: number, { isDarkTheme }) {
    await this.userManagerService.catchUserNotExists(userId);
    await this.userManagerService.update(userId, isDarkTheme);
    return await this.userManagerService.findOne(userId);
  }

  async deleteUser(userId: number) {
    await this.userManagerService.catchUserNotExists(userId);
    return this.userManagerService.delete(userId);
  }
}
