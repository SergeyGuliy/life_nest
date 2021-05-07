import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Messages } from '../../plugins/database/entities/messages.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Messages])],
  providers: [ChatsService, ChatsGateway],
})
export class ChatsModule {}
