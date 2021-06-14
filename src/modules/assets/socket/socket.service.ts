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
import { SocketNameSpacerService } from './socket-namespaser.service';

@Injectable()
export class SocketService {
  constructor(
    @Inject(forwardRef(() => RoomsService))
    private roomsService: RoomsService,
    private socketNameSpacerService: SocketNameSpacerService,

    @InjectRepository(Users)
    private usersRepository: Repository<Users>, // @InjectRepository(Rooms) // private roomsRepository: Repository<Rooms>,
  ) {}

  async logOutUserFormApp(userId) {
    const newUserSid = this.socketNameSpacerService.findSidByUserId(userId);
    if (!newUserSid) {
      await this.userLogOut(userId);
      const newUserData = await this.getUserById(userId);
      await this.roomsService.userLeaveRoom(newUserData);
    }
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
