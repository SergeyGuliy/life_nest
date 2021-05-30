import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { RoomsService } from '../rooms/rooms.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../../plugins/database/entities/users.entity';
import { Repository } from 'typeorm';
import { Rooms } from '../../plugins/database/entities/rooms.entity';
import {
  addUser,
  deleteUser,
  findSidByUserId,
  findUserIdBySid,
} from '../../plugins/helpers/socket-transformer';

@Injectable()
export class WebSocketService {
  constructor(
    private userService: UserService,
    private roomsService: RoomsService,

    @InjectRepository(Users)
    private usersRepository: Repository<Users>,

    @InjectRepository(Rooms)
    private roomsRepository: Repository<Rooms>,
  ) {}

  async logOutUserFormApp(userSid) {
    const userId = findUserIdBySid(userSid);
    deleteUser(userSid);
    const newUserSid = findSidByUserId(userId);
    if (!newUserSid) {
      await this.userService.userLogOut(userId);
      const newUserData = await this.userService.getUserById(userId);
      this.roomsService.userLeaveRoom(newUserData);
    }
  }

  async logInUserIntoApp(userId, clientId) {
    await this.userService.userLogIn(userId);
    addUser(clientId, userId);
  }
}
