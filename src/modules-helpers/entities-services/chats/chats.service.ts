import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Messages } from './messages.entity';

@Injectable()
export class ChatsManagerService {
  constructor(
    @InjectRepository(Messages)
    private readonly messagesRepository: Repository<Messages>,
  ) {}

  async save(messageData) {
    return await this.messagesRepository.save(messageData);
  }

  async findOne(messageId, query) {
    return await this.messagesRepository.findOne(messageId, query);
  }

  async find(query) {
    return await this.messagesRepository.find(query);
  }
}
