import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Messages } from '../../plugins/database/entities/messages.entity';
import { ChatsController } from './chats.controller';
import { SocketNameSpacerService } from '../../assets/socket/socket-namespaser.service';

@Module({
  imports: [TypeOrmModule.forFeature([Messages])],
  controllers: [ChatsController],
  providers: [SocketNameSpacerService, ChatsService, ChatsGateway],
})
export class ChatsModule {}
