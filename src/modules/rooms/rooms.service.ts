import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rooms } from '../../plugins/database/entities/rooms.entity';
import { Repository } from 'typeorm';
import { Users } from '../../plugins/database/entities/users.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Rooms)
    private roomsRepository: Repository<Rooms>,
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  async createRoom(creatorId, roomData) {
    const newRoom = await this.roomsRepository.save({
      ...roomData,
      creatorId,
      roomJoinedId: creatorId,
    });
    await this.userRepository.update(creatorId, {
      createdRoomId: newRoom.roomId,
      roomJoinedId: newRoom.roomId,
    });
    const updatedUser = await this.userRepository.findOne({
      where: {
        userId: creatorId,
      },
    });
    // console.log(updatedUser);

    // console.log(await this.getUsersInRoom(newRoom.roomId));
    return newRoom;
  }

  async getUsersInRoom(roomId) {
    return await this.userRepository.find({ where: { roomJoinedId: roomId } });
  }

  async getRooms(query) {
    if (query.typeOfRoom?.length) {
      const where = query.typeOfRoom.map((i) => {
        const newI = {
          typeOfRoom: i,
        };
        if (query.roomName) {
          newI['roomName'] = query.roomName;
        }
        return newI;
      });
      return await this.roomsRepository.find({
        where,
      });
    } else {
      return [];
    }
  }

  async getRoomById(roomId) {
    const usersInRoom = await this.userRepository.find({
      where: { roomJoinedId: roomId },
    });
    const roomData = await this.roomsRepository.findOne({
      where: { roomId },
    });
    return {
      ...roomData,
      usersInRoom: usersInRoom.map((user) => {
        const { password, refreshToken, ...userData } = user;
        return userData;
      }),
    };
  }

  async deleteRoom(roomId) {
    return await this.roomsRepository.delete(roomId);
  }

  async leaveRoom(user) {
    const { roomJoinedId, userId } = user;
    await this.userRepository.update(userId, {
      createdRoomId: null,
      roomJoinedId: null,
    });

    const newUserData = await this.userRepository.findOne({
      where: {
        userId,
      },
    });
    await this.checkIsUsersInRoom(roomJoinedId);
    return newUserData;
  }

  async checkIsUsersInRoom(roomId) {
    const usersInRoom = await this.userRepository.find({
      where: {
        roomJoinedId: roomId,
      },
    });
    if (!usersInRoom.length) {
      this.deleteRoom(roomId);
    }
  }
}
