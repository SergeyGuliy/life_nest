import {
  ClassSerializerInterceptor,
  Injectable,
  UseInterceptors,
} from '@nestjs/common';

import { ChatsManagerService } from '../../assets/entitiesManagers/chats/chats.service';
import { MESSAGE_RECEIVER_TYPES } from '../../plugins/database/enums';

@Injectable()
export class ChatsService {
  constructor(private readonly chatsManagerService: ChatsManagerService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  async saveMessage(messageData) {
    const savedMessage = await this.chatsManagerService.save(messageData);
    return await this.chatsManagerService.findOne(savedMessage.messageId, {
      relations: ['messageSender'],
    });
  }

  async getAllGlobalMessages() {
    return await this.chatsManagerService.find({
      where: {
        messageReceiverType: MESSAGE_RECEIVER_TYPES.GLOBAL,
      },
      relations: ['messageSender'],
    });
  }

  async getAllPrivateMessages(userId) {
    return await this.chatsManagerService.find({
      where: [
        {
          messageReceiverType: MESSAGE_RECEIVER_TYPES.PRIVATE,
          messageSender: userId,
        },
        {
          messageReceiverType: MESSAGE_RECEIVER_TYPES.PRIVATE,
          messageReceiverUserId: userId,
        },
      ],
      relations: ['messageSender'],
    });
  }

  async getAllRoomMessages(roomJoinedId) {
    return await this.chatsManagerService.find({
      where: {
        messageReceiverType: MESSAGE_RECEIVER_TYPES.ROOM,
        messageReceiverRoomId: roomJoinedId,
      },
      relations: ['messageSender'],
    });
  }
}
