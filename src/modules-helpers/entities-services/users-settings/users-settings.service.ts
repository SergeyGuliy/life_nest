import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserSettings } from './users-settings.entity.js';

@Injectable()
export class UsersSettingsManager {
  @InjectRepository(UserSettings)
  public readonly db: Repository<UserSettings>;
}
