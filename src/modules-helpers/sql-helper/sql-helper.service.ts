import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Users } from '../entities-services/users/users.entity.js';
import { Rooms } from '../entities-services/rooms/rooms.entity.js';
import { Messages } from '../entities-services/chats/messages.entity.js';
import { Friendships } from '../entities-services/friendships/friendships.entity.js';

@Injectable()
export class SqlHelperService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Rooms)
    private roomsRepository: Repository<Rooms>,
    @InjectRepository(Messages)
    private messagesRepository: Repository<Messages>,
    @InjectRepository(Friendships)
    private messagesFriendships: Repository<Friendships>,
  ) {}

  async getAllUser() {
    return await this.usersRepository.find();
  }
  async deleteAllUser() {
    return await this.usersRepository.clear();
  }
  async deleteAllRooms() {
    return await this.roomsRepository.clear();
  }
  async deleteAllMessages() {
    return await this.messagesRepository.clear();
  }
  async deleteAllFriendship() {
    return await this.messagesFriendships.clear();
  }
}
