import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { RoomsService } from '../../rooms/rooms.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../database/entities/users.entity';
import { Repository } from 'typeorm';
import { UserOnlineStatus } from '../database/enums';
import { SocketNamespaserService } from '../socket-namespaser/socket-namespaser.service';

@Injectable()
export class WebSocketService {
  constructor(
    @Inject(forwardRef(() => RoomsService))
    private roomsService: RoomsService,
    private socketNamespaserService: SocketNamespaserService,

    @InjectRepository(Users)
    private usersRepository: Repository<Users>, // @InjectRepository(Rooms) // private roomsRepository: Repository<Rooms>,
  ) {}
  private mapOfUsers = {};

  async logOutUserFormApp(userSid) {
    const userId = this.socketNamespaserService.findUserIdBySid(userSid);
    this.socketNamespaserService.deleteUser(userSid);
    const newUserSid = this.socketNamespaserService.findSidByUserId(userId);
    if (!newUserSid) {
      await this.userLogOut(userId);
      const newUserData = await this.getUserById(userId);
      this.roomsService.userLeaveRoom(newUserData);
    }
  }

  async logInUserIntoApp(userId, clientId) {
    await this.userLogIn(userId);
    this.socketNamespaserService.addUser(clientId, userId);
  }

  async userLogIn(userId: number) {
    return await this.usersRepository.update(userId, {
      userOnlineStatus: UserOnlineStatus.ONLINE,
    });
  }

  async userLogOut(userId: number) {
    await this.usersRepository.update(userId, {
      userOnlineStatus: UserOnlineStatus.OFFLINE,
    });
  }

  async getUserById(userId: number) {
    const user = await this.usersRepository.findOne(userId);
    if (user) {
      return user;
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }
}
