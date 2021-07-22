import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rooms } from '../../plugins/database/entities/rooms.entity';
import { Users } from '../../plugins/database/entities/users.entity';
import { RoomsSocketGateway } from './rooms.gateway';
// import { SocketModule } from '../../assets/socket/socket.module';
import { UserModule } from '../users/user.module';
import { SocketNameSpacerService } from '../../assets/socket/socket-namespaser.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rooms, Users]),
    // SocketModule,
    UserModule,
  ],
  controllers: [RoomsController],
  providers: [RoomsService, RoomsSocketGateway, SocketNameSpacerService],
})
export class RoomsModule {}
