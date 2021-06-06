import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rooms } from '../assets/database/entities/rooms.entity';
import { Users } from '../assets/database/entities/users.entity';
import { RoomsSocketGateway } from './rooms.gateway';
import { WebSocketModule } from '../assets/web-socket/web-socket.module';
import { UserModule } from '../users/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rooms, Users]),
    WebSocketModule,
    UserModule,
  ],
  controllers: [RoomsController],
  providers: [RoomsService, RoomsSocketGateway],
})
export class RoomsModule {}
