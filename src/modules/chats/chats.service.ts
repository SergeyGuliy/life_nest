import {
  ClassSerializerInterceptor,
  Injectable,
  UseInterceptors,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Messages } from '../../plugins/database/entities/messages.entity';
import { ChatsGateway } from './chats.gateway';
import { UserService } from '../users/user.service';
import { MessageReceiverTypes } from '../../plugins/database/entities/enums';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Messages)
    private readonly messagesRepository: Repository<Messages>,
    private userService: UserService,
  ) {}
  private chatGateway: ChatsGateway;

  @UseInterceptors(ClassSerializerInterceptor)
  async saveMessage(messageData) {
    console.log(messageData);
    let savedMessage = await this.messagesRepository.save(messageData);
    savedMessage = await this.messagesRepository.findOne(
      savedMessage.messageId,
      { relations: ['messageSender'] },
    );
    const {
      password,
      refreshToken,
      isDarkTheme,
      ...messageSender
    } = savedMessage.messageSender;
    savedMessage.messageSender = messageSender;
    return savedMessage;
  }

  async getAllGlobalMessages() {
    const globalMessages = await this.messagesRepository.find({
      where: {
        messageReceiverType: MessageReceiverTypes.GLOBAL,
      },
      relations: ['messageSender'],
    });
    return globalMessages.map((message) => {
      const {
        password,
        refreshToken,
        isDarkTheme,
        ...messageSender
      } = message.messageSender;
      return {
        ...message,
        messageSender,
      };
    });
  }

  async getAllPrivateMessages(userId) {
    const privateMessages = await this.messagesRepository.find({
      where: {
        messageReceiverType: MessageReceiverTypes.PRIVATE,
        messageReceiverUserId: userId,
      },
      relations: ['messageSender'],
    });
    return privateMessages.map((message) => {
      const {
        password,
        refreshToken,
        isDarkTheme,
        ...messageSender
      } = message.messageSender;
      return {
        ...message,
        messageSender,
      };
    });
  }

  async getAllRoomMessages(roomJoinedId) {
    const roomMessages = await this.messagesRepository.find({
      where: {
        messageReceiverType: MessageReceiverTypes.ROOM,
        messageReceiverRoomId: roomJoinedId,
      },
      relations: ['messageSender'],
    });
    return roomMessages.map((message) => {
      const {
        password,
        refreshToken,
        isDarkTheme,
        ...messageSender
      } = message.messageSender;
      return {
        ...message,
        messageSender,
      };
    });
  }
}
