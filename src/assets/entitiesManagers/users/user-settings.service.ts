import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserSettings } from '../../../plugins/database/entities/users-settings.entity';

@Injectable()
export class UserSettingsManagerService {
  constructor(
    @InjectRepository(UserSettings)
    private userSettingsRepository: Repository<UserSettings>,
  ) {}

  async saveUserSettings(userSettings) {
    return await this.userSettingsRepository.save(userSettings);
  }
}
