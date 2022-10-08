import {
  ClassSerializerInterceptor,
  Inject,
  Injectable,
  UseInterceptors,
} from '@nestjs/common';

import { ChatsManager } from '@modules-helpers/entities-services/chats/chats.service';
import { MESSAGE_RECEIVER_TYPES } from '@enums/index.js';

@Injectable()
export class ChatsService {
  @Inject(ChatsManager)
  private readonly chatsService: ChatsManager;

  @UseInterceptors(ClassSerializerInterceptor)
  public async saveMessage(messageData) {
    return await this.chatsService.saveAndReturn(messageData);
  }

  public async getAllGlobalMessages() {
    return await this.chatsService.db.find({
      where: {
        messageReceiverType: MESSAGE_RECEIVER_TYPES.GLOBAL,
      },
      relations: ['messageSender'],
    });
  }

  public async getAllPrivateMessages(userId) {
    return await this.chatsService.db.find({
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

  public async getAllRoomMessages(roomJoinedId) {
    return await this.chatsService.db.find({
      where: {
        messageReceiverType: MESSAGE_RECEIVER_TYPES.ROOM,
        messageReceiverRoomId: roomJoinedId,
      },
      relations: ['messageSender'],
    });
  }
}
