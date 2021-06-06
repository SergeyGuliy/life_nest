import {
  ClassSerializerInterceptor,
  Injectable,
  UseInterceptors,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Messages } from '../assets/database/entities/messages.entity';
import { MessageReceiverTypes } from '../assets/database/enums';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Messages)
    private readonly messagesRepository: Repository<Messages>,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  async saveMessage(messageData) {
    const savedMessage = await this.messagesRepository.save(messageData);
    return await this.messagesRepository.findOne(savedMessage.messageId, {
      relations: ['messageSender'],
    });
  }

  async getAllGlobalMessages() {
    return await this.messagesRepository.find({
      where: {
        messageReceiverType: MessageReceiverTypes.GLOBAL,
      },
      relations: ['messageSender'],
    });
  }

  async getAllPrivateMessages(userId) {
    return await this.messagesRepository.find({
      where: [
        {
          messageReceiverType: MessageReceiverTypes.PRIVATE,
          messageSender: userId,
        },
        {
          messageReceiverType: MessageReceiverTypes.PRIVATE,
          messageReceiverUserId: userId,
        },
      ],
      relations: ['messageSender'],
    });
  }

  async getAllRoomMessages(roomJoinedId) {
    return await this.messagesRepository.find({
      where: {
        messageReceiverType: MessageReceiverTypes.ROOM,
        messageReceiverRoomId: roomJoinedId,
      },
      relations: ['messageSender'],
    });
  }
}
