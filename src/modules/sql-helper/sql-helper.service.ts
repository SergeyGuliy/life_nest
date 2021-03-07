import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Users } from '../../plugins/database/entities/user.entity';

@Injectable()
export class SqlHelperService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async deleteAllUser() {
    return await this.usersRepository.clear();
  }
}
