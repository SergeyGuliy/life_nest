import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Messages } from './messages.entity';

@Injectable()
export class ChatsManager {
  @InjectRepository(Messages)
  public readonly db: Repository<Messages>;

  public async saveAndReturn(messageData) {
    const savedMessage = await this.db.save(messageData);
    return await this.db.findOne(savedMessage.messageId, {
      relations: ['messageSender'],
    });
  }
}
