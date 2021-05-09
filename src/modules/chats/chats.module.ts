import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Messages } from '../../plugins/database/entities/messages.entity';
import { UserService } from '../users/user.service';
import { Users } from '../../plugins/database/entities/users.entity';
import { ChatsController } from './chats.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Messages, Users])],
  controllers: [ChatsController],
  providers: [ChatsService, ChatsGateway, UserService],
})
export class ChatsModule {}
