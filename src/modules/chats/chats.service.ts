import {
  ClassSerializerInterceptor,
  Injectable,
  UseInterceptors,
} from '@nestjs/common';
import { ChatsManagerService } from '../../assets/entitiesManagers/chats/chats.service';

@Injectable()
export class ChatsService {
  constructor(private readonly chatsManagerService: ChatsManagerService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  async saveMessage(messageData) {
    return await this.chatsManagerService.saveMessage(messageData);
  }

  async getAllGlobalMessages() {
    return await this.chatsManagerService.getAllGlobalMessages();
  }

  async getAllPrivateMessages(userId) {
    return await this.chatsManagerService.getAllPrivateMessages(userId);
  }

  async getAllRoomMessages(roomJoinedId) {
    return await this.chatsManagerService.getAllRoomMessages(roomJoinedId);
  }
}
