import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Messages } from '../../plugins/database/entities/messages.entity';
import { ChatsController } from './chats.controller';
import { SocketNamespaserModule } from '../socket-namespaser/socket-namespaser.module';

@Module({
  imports: [SocketNamespaserModule, TypeOrmModule.forFeature([Messages])],
  controllers: [ChatsController],
  providers: [ChatsService, ChatsGateway],
})
export class ChatsModule {}
