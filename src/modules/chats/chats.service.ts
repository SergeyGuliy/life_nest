import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Messages } from '../../plugins/database/entities/messages.entity';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Messages)
    private messagesRepository: Repository<Messages>,
  ) {}

  async saveMessage(messageData) {
    console.log(messageData);
    const newMessage = await this.messagesRepository.save({});
    console.log(newMessage);
  }

  async getAllMessages() {}
}
