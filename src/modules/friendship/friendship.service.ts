import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Friendships } from '../assets/database/entities/friendships.entity';

@Injectable()
export class FriendshipService {
  constructor(
    @InjectRepository(Friendships)
    private friendshipRepository: Repository<Friendships>,
  ) {}

  async getAllFriendship() {
    console.log('getAllFriendship');
    return await this.friendshipRepository.find();
  }

  async userSendFriendshipRequest(reciverId, senderId) {
    console.log(reciverId);
    console.log(senderId);
    const savedMessage = await this.friendshipRepository.save({
      friendshipReceiver: { userId: reciverId },
      friendshipSender: { userId: senderId },
    });
    console.log(savedMessage);
  }

  async userAcceptFriendshipRequest(reciverId, senderId) {
    return '';
  }

  async userDeclineFriendshipRequest(reciverId, senderId) {
    return '';
  }
}
