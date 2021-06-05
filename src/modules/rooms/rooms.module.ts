import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rooms } from '../../plugins/database/entities/rooms.entity';
import { JwtModule } from '@nestjs/jwt';
import { Users } from '../../plugins/database/entities/users.entity';
import { RoomsSocketGateway } from './rooms.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rooms, Users]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_AT },
    }),
  ],
  controllers: [RoomsController],
  providers: [RoomsService, RoomsSocketGateway],
})
export class RoomsModule {}
