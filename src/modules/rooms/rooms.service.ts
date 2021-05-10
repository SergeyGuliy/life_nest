import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rooms } from '../../plugins/database/entities/rooms.entity';
import { Repository } from 'typeorm';
import { RoomsSocketGateway } from './rooms.gateway';
import { UserService } from '../users/user.service';
import { random } from 'lodash';
import { log } from 'util';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Rooms)
    private roomsRepository: Repository<Rooms>,
    private roomsSocketGateway: RoomsSocketGateway,
    private userService: UserService,
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
      const roomsWIthUsers = await Promise.all(
        rooms.map(async (room) => {
          return {
            ...room,
            usersInRoom: await this.userService.getUsersByQuery({
              where: {
                roomJoinedId: room.roomId,
              },
            }),
          };
        }),
      );
      return roomsWIthUsers;
    } else {
      return [];
    }
  }

  async getRoomDataById(query) {
    return await this.roomsRepository.findOne(query);
  }

  async getRoomById(roomId) {
    const usersInRoom = await this.userService.getUsersByQuery({
      where: { roomJoinedId: roomId },
    });
    const creator = await this.userService.getUserByQuery({
      where: { createdRoomId: roomId },
    });
    const { roomPassword, ...roomData } = await this.getRoomDataById({
      where: { roomId },
    });
    return {
      ...roomData,
      usersInRoom,
      creator,
    };
  }

  async createRoom(creatorId, roomData) {
    const newRoom = await this.roomsRepository.save({
      ...roomData,
      creatorId,
      roomJoinedId: creatorId,
    });
    await this.userService.updateUser(creatorId, {
      createdRoomId: newRoom.roomId,
      roomJoinedId: newRoom.roomId,
    });
    const usersInRoom = await this.userService.getUsersByQuery({
      where: { roomJoinedId: newRoom.roomId },
    });
    this.roomsSocketGateway.roomInListCreated({ ...newRoom, usersInRoom });
    return newRoom;
  }

  async userJoinRoom(userId: number, roomId: number, roomPassword: string) {
    const roomData = await this.getRoomDataById({
      where: { roomId },
    });
    passwordValidation(roomData, roomPassword);

    let usersInRoom = await this.userService.getUsersByQuery({
      where: { roomJoinedId: roomId },
    });
    countOfUsersValidation(usersInRoom.length, roomData.maxCountOfUsers);

    await this.userService.updateUser(userId, {
      createdRoomId: null,
      roomJoinedId: roomId,
    });
    usersInRoom = await this.userService.getUsersByQuery({
      where: { roomJoinedId: roomId },
    });
    this.roomsSocketGateway.roomInListUpdated(roomId, {
      ...roomData,
      usersInRoom,
    });
    this.roomsSocketGateway.updateUsersListInRoom(roomId, usersInRoom);
    return await this.userService.getUserByQuery({
      where: {
        userId,
      },
    });
  }

  async userLeaveRoom(user) {
    const { roomJoinedId, createdRoomId, userId } = user;

    await this.userService.updateUser(userId, {
      createdRoomId: null,
      roomJoinedId: null,
    });
    const newUserData = await this.userService.getUserByQuery({
      where: {
        userId,
      },
    });
    const roomData = await this.getRoomDataById({
      where: { roomId: roomJoinedId },
    });
    const usersInRoom = await this.userService.getUsersByQuery({
      where: { roomJoinedId: roomJoinedId },
    });
    this.roomsSocketGateway.updateUsersListInRoom(roomJoinedId, usersInRoom);
    this.roomsSocketGateway.userLeaveRoom(newUserData.userId);
    await this.setNewAdminOrDelete(roomJoinedId, createdRoomId, roomData);
    return newUserData;
  }

  async setNewAdminOrDelete(
    roomJoinedId: number,
    createdRoomId: number,
    roomData,
  ) {
    const usersInRoom = await this.userService.getUsersByQuery({
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
      usersInRoom,
    });
    if (createdRoomId === roomJoinedId) {
      const idOfNewAdmin = usersInRoom[random(usersInRoom.length - 1)].userId;
      await this.userService.updateUser(idOfNewAdmin, {
        createdRoomId: roomJoinedId,
      });
      const newAdmin = await this.userService.getUserByQuery({
        where: { userId: idOfNewAdmin },
      });
      console.log(newAdmin);
      this.roomsSocketGateway.updateRoomAdmin(roomJoinedId, newAdmin);
    }
  }

  async kickUserFromRoom() {}

  async deleteRoom(roomId) {
    this.roomsSocketGateway.roomInListDeleted(roomId);
    return await this.roomsRepository.delete(roomId);
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
