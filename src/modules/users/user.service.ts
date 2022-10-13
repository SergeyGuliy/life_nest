import { Inject, Injectable } from '@nestjs/common';

import { UsersManager } from '@modules-helpers/entities-services/users/users.service';

@Injectable()
export class UserService {
  @Inject(UsersManager)
  private readonly usersManager: UsersManager;

  public async getUserById(userId: number) {
    return await this.usersManager.db.findOne(userId);
  }
}
