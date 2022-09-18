import { Injectable } from '@nestjs/common';
import { random } from 'lodash';

import { RoomsWsEmitter } from './ws/rooms.ws-emitter';

import { RoomsManagerService } from '../../sub_modules/entitiesManagers/rooms/rooms.service';
import { UserManagerService } from '../../sub_modules/entitiesManagers/users/user.service';
import { ErrorHandlerService } from '../../sub_modules/globalServices/error-handler.service';

@Injectable()
export class RoomsService {
  constructor(
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly roomsWsEmitter: RoomsWsEmitter,
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
    const roomData = await this.getRoomDataById({
      where: { roomId },
    });
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
    this.roomsWsEmitter.roomInListCreated({
      ...newRoom,
      usersInRoomLength: usersInRoom.length,
    });
    return newRoom;
  }

  async userJoinRoom(userId: number, roomId: number) {
    const roomData = await this.getRoomDataById({
      where: { roomId },
    });

    await this.userManagerService.update(userId, {
      roomCreatedId: null,
      roomJoinedId: roomId,
    });
    const usersInRoom = await this.userManagerService.find({
      where: { roomJoinedId: roomId },
    });
    this.roomsWsEmitter.roomInListUpdated(roomId, {
      ...roomData,
      usersInRoomLength: usersInRoom.length,
    });
    this.roomsWsEmitter.updateUsersListInRoom(roomId, usersInRoom);
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
    this.roomsWsEmitter.updateUsersListInRoom(roomJoinedId, usersInRoom);
    await this.roomsWsEmitter.userLeaveRoom(roomJoinedId, newUserData.userId);
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
    this.roomsWsEmitter.roomInListUpdated(roomJoinedId, {
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
      this.roomsWsEmitter.updateRoomAdmin(roomJoinedId, newAdmin);
    }
  }

  async toggleLockRoom(userId, roomId, lockState) {
    await this.roomsManagerService.update(roomId, {
      isBlocked: lockState,
    });
    await this.roomsWsEmitter.updateToggleLockRoom(roomId, lockState);
    return;
  }

  async deleteRoomRequest(userId, roomId) {
    const usersInRoom = await this.userManagerService.find({
      where: { roomJoinedId: roomId },
    });

    for await (const { userId } of usersInRoom) {
      await this.kickUserFromRoom(roomId, userId);
    }
    await this.deleteRoom(roomId);
  }

  async kickUserFromRoomRequest(senderUserId, roomId, kickUserId) {
    await this.kickUserFromRoom(roomId, kickUserId);
  }

  async deleteRoom(roomId) {
    this.roomsWsEmitter.roomInListDeleted(roomId);
    return await this.roomsManagerService.delete(roomId);
  }

  async kickUserFromRoom(roomId, kickUserId) {
    await this.userManagerService.update(kickUserId, {
      roomJoinedId: null,
    });
    await this.roomsWsEmitter.userLeaveRoom(roomId, kickUserId);
  }

  async setNewRoomAdmin(senderUserId, roomId, newAdminId) {
    await this.userManagerService.update(senderUserId, {
      roomCreatedId: null,
    });
    await this.userManagerService.update(newAdminId, {
      roomCreatedId: roomId,
    });
    const newAdmin = await this.userManagerService.findOne({
      where: { userId: newAdminId },
    });
    this.roomsWsEmitter.updateRoomAdmin(roomId, newAdmin);
    return;
  }
}
