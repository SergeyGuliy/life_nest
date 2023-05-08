import { Inject, Injectable } from '@nestjs/common';
import { random } from 'lodash';

import { RoomsWsEmitter } from './ws/rooms.ws-emitter';

import { RoomsManager } from '@modules-helpers/entities-services/rooms/rooms.service';
import { UsersManager } from '@modules-helpers/entities-services/users/users.service';
import { GamesService } from '@modules/games/games.service';

@Injectable()
export class RoomsService {
  @Inject(RoomsWsEmitter)
  private readonly roomsWsEmitter: RoomsWsEmitter;
  @Inject(RoomsManager)
  private readonly roomsManager: RoomsManager;
  @Inject(UsersManager)
  private readonly usersManager: UsersManager;
  @Inject(GamesService)
  private readonly gamesService: GamesService;

  private async setNewAdminOrDelete(
    roomJoinedId: number,
    roomCreatedId: number,
    roomData,
  ) {
    const usersInRoom = await this.usersManager.db.find({
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

  private async setNewAdmin(
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
      await this.usersManager.db.update(idOfNewAdmin, {
        roomCreatedId: roomJoinedId,
      });
      const newAdmin = await this.usersManager.db.findOne({
        where: { userId: idOfNewAdmin },
      });
      this.roomsWsEmitter.updateRoomAdmin(roomJoinedId, newAdmin);
    }
  }

  public async getRooms(query) {
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
      const rooms = await this.roomsManager.db.find({
        where,
      });
      return await Promise.all(
        rooms.map(async (room) => {
          return {
            ...room,
            usersInRoomLength: (
              await this.usersManager.db.find({
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

  public async getRoomById(roomId) {
    const roomData = await this.roomsManager.db.findOne(roomId);
    const usersInRoom = await this.usersManager.getUsersInRoom(roomId);

    return {
      ...roomData,
      usersInRoom,
    };
  }

  public async createRoom(creatorId, roomData) {
    const newRoom = await this.roomsManager.db.save({
      ...roomData,
      creatorId,
      roomJoinedId: creatorId,
    });
    await this.usersManager.db.update(creatorId, {
      roomCreatedId: newRoom.roomId,
      roomJoinedId: newRoom.roomId,
    });

    const usersInRoom = await this.usersManager.getUsersInRoom(newRoom.roomId);

    this.roomsWsEmitter.roomInListCreated({
      ...newRoom,
      usersInRoomLength: usersInRoom.length,
    });
    return newRoom;
  }

  public async userJoinRoom(userId: number, roomId: number) {
    const roomData = await this.roomsManager.db.findOne({
      where: { roomId },
    });

    await this.usersManager.db.update(userId, {
      roomCreatedId: null,
      roomJoinedId: roomId,
    });

    const usersInRoom = await this.usersManager.getUsersInRoom(roomId);

    this.roomsWsEmitter.roomInListUpdated(roomId, {
      ...roomData,
      usersInRoomLength: usersInRoom.length,
    });
    this.roomsWsEmitter.updateUsersListInRoom(roomId, usersInRoom);
    return await this.usersManager.db.findOne({
      where: {
        userId,
      },
    });
  }

  public async userLeaveRoom(user) {
    const { userId } = user;
    const { roomJoinedId, roomCreatedId } = await this.usersManager.db.findOne(
      userId,
    );
    await this.usersManager.db.update(userId, {
      roomCreatedId: null,
      roomJoinedId: null,
    });
    const newUserData = await this.usersManager.db.findOne({
      where: {
        userId,
      },
    });
    const roomData = await this.roomsManager.db.findOne({
      where: { roomId: roomJoinedId },
    });

    const usersInRoom = await this.usersManager.getUsersInRoom(roomJoinedId);

    this.roomsWsEmitter.updateUsersListInRoom(roomJoinedId, usersInRoom);
    await this.roomsWsEmitter.userLeaveRoom(roomJoinedId, newUserData.userId);
    await this.setNewAdminOrDelete(roomJoinedId, roomCreatedId, roomData);
    return newUserData;
  }

  public async toggleLockRoom(userId, roomId, lockState) {
    await this.roomsManager.db.update(roomId, {
      isBlocked: lockState,
    });
    await this.roomsWsEmitter.updateToggleLockRoom(roomId, lockState);
    return;
  }

  public async deleteRoomRequest(userId, roomId) {
    const usersInRoom = await this.usersManager.getUsersInRoom(roomId);

    for await (const { userId } of usersInRoom) {
      await this.kickUserFromRoom(roomId, userId);
    }
    await this.deleteRoom(roomId);
  }

  public async kickUserFromRoomRequest(senderUserId, roomId, kickUserId) {
    await this.kickUserFromRoom(roomId, kickUserId);
  }

  public async deleteRoom(roomId) {
    this.roomsWsEmitter.roomInListDeleted(roomId);
    const { gameId } = await this.roomsManager.db.findOne(roomId);
    if (gameId) {
      this.gamesService.stopGame(gameId);
    }
    return await this.roomsManager.db.delete(roomId);
  }

  public async kickUserFromRoom(roomId, kickUserId) {
    await this.usersManager.db.update(kickUserId, {
      roomJoinedId: null,
    });
    await this.roomsWsEmitter.userLeaveRoom(roomId, kickUserId);
  }

  public async setNewRoomAdmin(senderUserId, roomId, newAdminId) {
    await this.usersManager.db.update(senderUserId, {
      roomCreatedId: null,
    });
    await this.usersManager.db.update(newAdminId, {
      roomCreatedId: roomId,
    });
    const newAdmin = await this.usersManager.db.findOne({
      where: { userId: newAdminId },
    });
    this.roomsWsEmitter.updateRoomAdmin(roomId, newAdmin);
    return;
  }
}
