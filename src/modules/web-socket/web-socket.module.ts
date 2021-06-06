import { Module } from '@nestjs/common';
import { SocketGateway } from './web-socket.gateway';
import { WebSocketService } from './web-socket.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rooms } from '../../plugins/database/entities/rooms.entity';
import { Users } from '../../plugins/database/entities/users.entity';
import { RoomsService } from '../rooms/rooms.service';
import { UserService } from '../users/user.service';
import { RoomsSocketGateway } from '../rooms/rooms.gateway';
import { Messages } from '../../plugins/database/entities/messages.entity';
import { SocketNamespaserService } from '../socket-namespaser/socket-namespaser.service';

@Module({
  imports: [TypeOrmModule.forFeature([Rooms, Users, Messages])],
  providers: [
    RoomsService,
    UserService,
    SocketGateway,
    WebSocketService,
    RoomsSocketGateway,
    SocketNamespaserService,
  ],
  exports: [WebSocketService],
})
export class WebSocketModule {}
