import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rooms } from '../assets/database/entities/rooms.entity';
import { Repository } from 'typeorm';
import { RoomsSocketGateway } from './rooms.gateway';
import { random } from 'lodash';
import { Users } from '../assets/database/entities/users.entity';
import { UpdateUserDto } from '../users/dto/updateUser.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Rooms)
    private roomsRepository: Repository<Rooms>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private roomsSocketGateway: RoomsSocketGateway,
  ) {}

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
      const rooms = await this.roomsRepository.find({
        where,
      });
      const roomsWithUsers = await Promise.all(
        rooms.map(async (room) => {
          return {
            ...room,
            usersInRoomLength: (
              await this.getUsersByQuery({
                where: {
                  roomJoinedId: room.roomId,
                },
              })
            ).length,
          };
        }),
      );
      return roomsWithUsers;
    } else {
      return [];
    }
  }

  async getRoomDataById(query) {
    return await this.roomsRepository.findOne(query);
  }

  async getRoomById(roomId) {
    const usersInRoom = await this.getUsersByQuery({
      where: { roomJoinedId: roomId },
    });
    const { roomPassword, ...roomData } = await this.getRoomDataById({
      where: { roomId },
    });
    return {
      ...roomData,
      usersInRoom,
      creator: usersInRoom.find(
        (user) => user.roomJoinedId === user.createdRoomId,
      ),
    };
  }

  async createRoom(creatorId, roomData) {
    const newRoom = await this.roomsRepository.save({
      ...roomData,
      creatorId,
      roomJoinedId: creatorId,
    });
    await this.updateUser(creatorId, {
      createdRoomId: newRoom.roomId,
      roomJoinedId: newRoom.roomId,
    });
    const usersInRoom = await this.getUsersByQuery({
      where: { roomJoinedId: newRoom.roomId },
    });
    this.roomsSocketGateway.roomInListCreated({
      ...newRoom,
      usersInRoomLength: usersInRoom.length,
    });
    return newRoom;
  }

  async userJoinRoom(userId: number, roomId: number, roomPassword: string) {
    const roomData = await this.getRoomDataById({
      where: { roomId },
    });
    passwordValidation(roomData, roomPassword);

    let usersInRoom = await this.getUsersByQuery({
      where: { roomJoinedId: roomId },
    });
    countOfUsersValidation(usersInRoom.length, roomData.maxCountOfUsers);

    await this.updateUser(userId, {
      createdRoomId: null,
      roomJoinedId: roomId,
    });
    usersInRoom = await this.getUsersByQuery({
      where: { roomJoinedId: roomId },
    });
    this.roomsSocketGateway.roomInListUpdated(roomId, {
      ...roomData,
      usersInRoomLength: usersInRoom.length,
    });
    this.roomsSocketGateway.updateUsersListInRoom(roomId, usersInRoom);
    return await this.getUserByQuery({
      where: {
        userId,
      },
    });
  }

  async userLeaveRoom(user) {
    const { userId } = user;
    const { roomJoinedId, createdRoomId } = await this.usersRepository.findOne(
      userId,
    );
    await this.updateUser(userId, {
      createdRoomId: null,
      roomJoinedId: null,
    });
    const newUserData = await this.getUserByQuery({
      where: {
        userId,
      },
    });
    const roomData = await this.getRoomDataById({
      where: { roomId: roomJoinedId },
    });
    const usersInRoom = await this.getUsersByQuery({
      where: { roomJoinedId: roomJoinedId },
    });
    this.roomsSocketGateway.updateUsersListInRoom(roomJoinedId, usersInRoom);
    await this.roomsSocketGateway.userLeaveRoom(newUserData.userId);
    await this.setNewAdminOrDelete(roomJoinedId, createdRoomId, roomData);
    return newUserData;
  }

  async setNewAdminOrDelete(
    roomJoinedId: number,
    createdRoomId: number,
    roomData,
  ) {
    const usersInRoom = await this.getUsersByQuery({
      where: {
        roomJoinedId,
      },
    });
    if (!usersInRoom.length) {
      await this.deleteRoom(roomJoinedId);
    } else {
      await this.setNewAdmin(
        createdRoomId,
        roomJoinedId,
        usersInRoom,
        roomData,
      );
    }
  }

  async setNewAdmin(
    createdRoomId: number,
    roomJoinedId: number,
    usersInRoom,
    roomData,
  ) {
    this.roomsSocketGateway.roomInListUpdated(roomJoinedId, {
      ...roomData,
      usersInRoomLength: usersInRoom.length,
    });
    if (createdRoomId === roomJoinedId) {
      const idOfNewAdmin = usersInRoom[random(usersInRoom.length - 1)].userId;
      await this.updateUser(idOfNewAdmin, {
        createdRoomId: roomJoinedId,
      });
      const newAdmin = await this.getUserByQuery({
        where: { userId: idOfNewAdmin },
      });
      this.roomsSocketGateway.updateRoomAdmin(roomJoinedId, newAdmin);
    }
  }

  async kickUserFromRoom() {}

  async deleteRoom(roomId) {
    this.roomsSocketGateway.roomInListDeleted(roomId);
    return await this.roomsRepository.delete(roomId);
  }

  async getUserByQuery(query) {
    return await this.usersRepository.findOne(query);
  }

  async getUsersByQuery(query) {
    return await this.usersRepository.find(query);
  }

  async updateUser(userId: number, newUserData: UpdateUserDto) {
    await this.usersRepository.update(userId, newUserData);
  }
}

function passwordValidation(roomData, roomPassword) {
  if (
    roomData.typeOfRoom === 'PRIVATE' &&
    roomData.roomPassword !== roomPassword
  ) {
    throw new HttpException('Wrong room password', HttpStatus.BAD_REQUEST);
  }
}

function countOfUsersValidation(usersInRoomLength, maxCountOfUsers) {
  if (usersInRoomLength > maxCountOfUsers) {
    throw new HttpException('Room already full', HttpStatus.BAD_REQUEST);
  }
}
