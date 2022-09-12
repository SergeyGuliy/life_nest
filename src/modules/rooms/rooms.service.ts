import { Injectable } from '@nestjs/common';
import { random } from 'lodash';

import { RoomsSocketGateway } from './rooms.gateway';

import { RoomsManagerService } from '../../sub_modules/entitiesManagers/rooms/rooms.service';
import { UserManagerService } from '../../sub_modules/entitiesManagers/users/user.service';
import { ErrorHandlerService } from '../../sub_modules/globalServices/error-handler.service';

@Injectable()
export class RoomsService {
  constructor(
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly roomsSocketGateway: RoomsSocketGateway,
    private readonly roomsManagerService: RoomsManagerService,
    private readonly userManagerService: UserManagerService,
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
      const rooms = await this.roomsManagerService.find({
        where,
      });
      return await Promise.all(
        rooms.map(async (room) => {
          return {
            ...room,
            usersInRoomLength: (
              await this.userManagerService.find({
                where: {
                  roomJoinedId: room.roomId,
                },
              })
            ).length,
          };
        }),
      );
    } else {
      return [];
    }
  }

  async getRoomDataById(query) {
    return await this.roomsManagerService.findOne(query);
  }

  async getRoomById(roomId) {
    const usersInRoom = await this.userManagerService.find({
      where: { roomJoinedId: roomId },
    });
    console.log(roomId)
    const roomData = await this.getRoomDataById({
      where: { roomId },
    });
    console.log(roomData);
    return {
      ...roomData,
      usersInRoom,
    };
  }

  async createRoom(creatorId, roomData) {
    const newRoom = await this.roomsManagerService.save({
      ...roomData,
      creatorId,
      roomJoinedId: creatorId,
    });
    await this.userManagerService.update(creatorId, {
      roomCreatedId: newRoom.roomId,
      roomJoinedId: newRoom.roomId,
    });
    const usersInRoom = await this.userManagerService.find({
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

    blockingValidation(roomData);
    passwordValidation(roomData, roomPassword);

    let usersInRoom = await this.userManagerService.find({
      where: { roomJoinedId: roomId },
    });
    countOfUsersValidation(usersInRoom.length, roomData.maxCountOfUsers);

    await this.userManagerService.update(userId, {
      roomCreatedId: null,
      roomJoinedId: roomId,
    });
    usersInRoom = await this.userManagerService.find({
      where: { roomJoinedId: roomId },
    });
    this.roomsSocketGateway.roomInListUpdated(roomId, {
      ...roomData,
      usersInRoomLength: usersInRoom.length,
    });
    this.roomsSocketGateway.updateUsersListInRoom(roomId, usersInRoom);
    return await this.userManagerService.findOne({
      where: {
        userId,
      },
    });
  }

  async userLeaveRoom(user) {
    const { userId } = user;
    const {
      roomJoinedId,
      roomCreatedId,
    } = await this.userManagerService.findOne(userId);
    await this.userManagerService.update(userId, {
      roomCreatedId: null,
      roomJoinedId: null,
    });
    const newUserData = await this.userManagerService.findOne({
      where: {
        userId,
      },
    });
    const roomData = await this.getRoomDataById({
      where: { roomId: roomJoinedId },
    });
    const usersInRoom = await this.userManagerService.find({
      where: { roomJoinedId: roomJoinedId },
    });
    this.roomsSocketGateway.updateUsersListInRoom(roomJoinedId, usersInRoom);
    await this.roomsSocketGateway.userLeaveRoom(
      roomJoinedId,
      newUserData.userId,
    );
    await this.setNewAdminOrDelete(roomJoinedId, roomCreatedId, roomData);
    return newUserData;
  }

  async setNewAdminOrDelete(
    roomJoinedId: number,
    roomCreatedId: number,
    roomData,
  ) {
    const usersInRoom = await this.userManagerService.find({
      where: {
        roomJoinedId,
      },
    });
    if (!usersInRoom.length) {
      await this.deleteRoom(roomJoinedId);
    } else {
      await this.setNewAdmin(
        roomCreatedId,
        roomJoinedId,
        usersInRoom,
        roomData,
      );
    }
  }

  async setNewAdmin(
    roomCreatedId: number,
    roomJoinedId: number,
    usersInRoom,
    roomData,
  ) {
    this.roomsSocketGateway.roomInListUpdated(roomJoinedId, {
      ...roomData,
      usersInRoomLength: usersInRoom.length,
    });
    if (roomCreatedId === roomJoinedId) {
      const idOfNewAdmin = usersInRoom[random(usersInRoom.length - 1)].userId;
      await this.userManagerService.update(idOfNewAdmin, {
        roomCreatedId: roomJoinedId,
      });
      const newAdmin = await this.userManagerService.findOne({
        where: { userId: idOfNewAdmin },
      });
      this.roomsSocketGateway.updateRoomAdmin(roomJoinedId, newAdmin);
    }
  }

  async toggleLockRoom(userId, roomId, lockState) {
    await this.checkIsRoomAdmin(userId, roomId);
    await this.roomsManagerService.update(roomId, {
      isBlocked: lockState,
    });
    await this.roomsSocketGateway.updateToggleLockRoom(roomId, lockState);
    return;
  }

  async deleteRoomRequest(userId, roomId) {
    await this.checkIsRoomAdmin(userId, roomId);

    const usersInRoom = await this.userManagerService.find({
      where: { roomJoinedId: roomId },
    });

    for await (const { userId } of usersInRoom) {
      await this.kickUserFromRoom(roomId, userId);
    }
    await this.deleteRoom(roomId);
  }

  async kickUserFromRoomRequest(senderUserId, roomId, kickUserId) {
    await this.checkIsRoomAdmin(senderUserId, roomId);
    await this.kickUserFromRoom(roomId, kickUserId);
  }

  async deleteRoom(roomId) {
    console.log('deleteRoom')
    this.roomsSocketGateway.roomInListDeleted(roomId);
    return await this.roomsManagerService.delete(roomId);
  }

  async kickUserFromRoom(roomId, kickUserId) {
    await this.userManagerService.update(kickUserId, {
      roomJoinedId: null,
    });
    await this.roomsSocketGateway.userLeaveRoom(roomId, kickUserId);
  }

  async setNewRoomAdmin(senderUserId, roomId, newAdminId) {
    await this.checkIsRoomAdmin(senderUserId, roomId);

    await this.userManagerService.update(senderUserId, {
      roomCreatedId: null,
    });
    await this.userManagerService.update(newAdminId, {
      roomCreatedId: roomId,
    });
    const newAdmin = await this.userManagerService.findOne({
      where: { userId: newAdminId },
    });
    this.roomsSocketGateway.updateRoomAdmin(roomId, newAdmin);
    return;
  }

  async checkIsRoomAdmin(userId, roomId) {
    const { roomCreatedId } = await this.userManagerService.findOne({
      where: { userId },
    });
    if (+roomCreatedId === +roomId) return;
    this.errorHandlerService.error('isNotRoomAdmin', 'en');
  }
}

function passwordValidation(roomData, roomPassword) {
  if (
    roomData.typeOfRoom === 'PRIVATE' &&
    roomData.roomPassword !== roomPassword
  ) {
    this.errorHandlerService.error('wrongRoomPassword', 'en');
  }
}

function countOfUsersValidation(usersInRoomLength, maxCountOfUsers) {
  if (usersInRoomLength > maxCountOfUsers) {
    this.errorHandlerService.error('roomAlreadyFull', 'en');
  }
}

function blockingValidation(roomData) {
  if (roomData.isBlocked) {
    this.errorHandlerService.error('isNotRoomAdmin', 'en');
  }
}
