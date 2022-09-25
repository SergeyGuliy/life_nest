import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserSettings } from './users-settings.entity';

@Injectable()
export class UsersSettingsManagerService {
  constructor(
    @InjectRepository(UserSettings)
    private userSettingsRepository: Repository<UserSettings>,
  ) {}

  async saveUserSettings(userSettings) {
    return await this.userSettingsRepository.save(userSettings);
  }
}
