import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Rooms } from './rooms.entity';

@Injectable()
export class RoomsManagerService {
  constructor(
    @InjectRepository(Rooms)
    private roomsRepository: Repository<Rooms>,
  ) {}

  async find(query) {
    return await this.roomsRepository.find(query);
  }

  async update(roomId, newRoomData) {
    await this.roomsRepository.update(roomId, newRoomData);
  }

  async findOne(query) {
    return await this.roomsRepository.findOne(query);
  }

  async save(newData) {
    return await this.roomsRepository.save(newData);
  }

  async delete(roomId) {
    return await this.roomsRepository.delete(roomId);
  }
}
