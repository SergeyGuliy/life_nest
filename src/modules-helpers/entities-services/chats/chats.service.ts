import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Messages } from './messages.entity';

@Injectable()
export class ChatsManagerService {
  @InjectRepository(Messages)
  private readonly messagesRepository: Repository<Messages>;

  public async save(messageData) {
    return await this.messagesRepository.save(messageData);
  }

  public async findOne(messageId, query) {
    return await this.messagesRepository.findOne(messageId, query);
  }

  public async find(query) {
    return await this.messagesRepository.find(query);
  }
}
