import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserSettings } from './users-settings.entity';

@Injectable()
export class UsersSettingsManagerService {
  @InjectRepository(UserSettings)
  private readonly userSettingsRepository: Repository<UserSettings>;

  public async saveUserSettings(userSettings) {
    return await this.userSettingsRepository.save(userSettings);
  }
}
