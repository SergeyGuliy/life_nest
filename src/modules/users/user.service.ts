import { Inject, Injectable } from '@nestjs/common';

import { UsersManagerService } from '@modules-helpers/entities-services/users/users.service';

@Injectable()
export class UserService {
  @Inject(UsersManagerService)
  private readonly userManagerService: UsersManagerService;

  public async getUserById(userId: number) {
    return await this.userManagerService.findOne(userId);
  }
}
