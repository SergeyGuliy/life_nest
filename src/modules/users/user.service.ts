import { Inject, Injectable } from '@nestjs/common';

import { UsersManagerService } from '@modules-helpers/entities-services/users/users.service';

@Injectable()
export class UserService {
  @Inject(UsersManagerService)
  private readonly userManagerService: UsersManagerService;

  public async getUserById(userId: number) {
    return await this.userManagerService.findOne(userId);
  }

  public async editUser(userId: number, user) {
    await this.userManagerService.catchUserNotExists(userId);
    await this.userManagerService.update(userId, user);
    return await this.userManagerService.findOne(userId);
  }

  public async changeUserTheme(userId: number, { isDarkTheme }) {
    await this.userManagerService.catchUserNotExists(userId);
    await this.userManagerService.update(userId, isDarkTheme);
    return await this.userManagerService.findOne(userId);
  }
}
