import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rooms } from '../database/entities/rooms.entity';
import { Users } from '../database/entities/users.entity';
import { RoomsService } from '../../rooms/rooms.service';
import { UserService } from '../../users/user.service';
import { RoomsSocketGateway } from '../../rooms/rooms.gateway';
import { Messages } from '../database/entities/messages.entity';
import { SocketNameSpacerService } from './socket-namespaser.service';

@Module({
  imports: [TypeOrmModule.forFeature([Rooms, Users, Messages])],
  providers: [
    RoomsService,
    UserService,
    SocketGateway,
    SocketService,
    RoomsSocketGateway,
    SocketNameSpacerService,
  ],
  exports: [SocketService, SocketNameSpacerService],
})
export class SocketModule {}
