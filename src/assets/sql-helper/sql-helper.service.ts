import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Users } from '../../plugins/database/entities/users.entity';
import { Rooms } from '../../plugins/database/entities/rooms.entity';
import { Messages } from '../../plugins/database/entities/messages.entity';
import { Friendships } from '../../plugins/database/entities/friendships.entity';

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



