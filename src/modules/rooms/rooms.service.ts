import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rooms } from '../../plugins/database/entities/rooms.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Rooms)
    private roomsRepository: Repository<Rooms>,
  ) {}

  async createRoom(roomData) {
    const newRoom = await this.roomsRepository.create(roomData);
    const newRoom1 = await this.roomsRepository.save(newRoom);
    return newRoom;
  }

  async getRooms() {
    return await this.roomsRepository.find();
  }

  async getRoomById(roomId) {
    return await this.roomsRepository.findOne({
      where: [{ roomId }],
    });
  }
}
