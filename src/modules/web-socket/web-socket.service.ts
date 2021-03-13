import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';

const messages = [];
@Injectable()
export class WebSocketService {
  constructor() {} // private readonly authenticationService: AuthenticationService, // @InjectRepository(Message) // private messagesRepository: Repository<Message>,

  async saveMessage(content: string) {
    messages.push(content);
    return content;
  }

  async getAllMessages() {
    return messages;
  }
}
