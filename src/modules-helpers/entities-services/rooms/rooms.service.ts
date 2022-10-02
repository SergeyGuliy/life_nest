import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Rooms } from './rooms.entity';

@Injectable()
export class RoomsManagerService {
  @InjectRepository(Rooms)
  private roomsRepository: Repository<Rooms>;

  public async find(query) {
    return await this.roomsRepository.find(query);
  }

  public async update(roomId, newRoomData) {
    await this.roomsRepository.update(roomId, newRoomData);
  }

  public async findOne(query) {
    return await this.roomsRepository.findOne(query);
  }

  public async save(newData) {
    return await this.roomsRepository.save(newData);
  }

  public async delete(roomId) {
    return await this.roomsRepository.delete(roomId);
  }
}
