import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Friendships } from '../../../plugins/database/entities/friendships.entity';

@Injectable()
export class FriendshipManagerService {
  constructor(
    @InjectRepository(Friendships)
    private friendshipRepository: Repository<Friendships>,
  ) {}

  async save(query) {
    return await this.friendshipRepository.save(query);
  }

  async update(friendshipId, newData) {
    return await this.friendshipRepository.update(friendshipId, newData);
  }

  async findOne(query) {
    return this.friendshipRepository.findOne(query);
  }

  async find(query) {
    return await this.friendshipRepository.find(query);
  }

  async delete(friendshipsId) {
    return this.friendshipRepository.delete(friendshipsId);
  }
}
