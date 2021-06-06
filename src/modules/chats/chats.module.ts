import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Messages } from '../assets/database/entities/messages.entity';
import { ChatsController } from './chats.controller';
import { SocketNamespaserService } from '../assets/socket/socket-namespaser.service';

@Module({
  imports: [TypeOrmModule.forFeature([Messages])],
  controllers: [ChatsController],
  providers: [SocketNamespaserService, ChatsService, ChatsGateway],
})
export class ChatsModule {}
