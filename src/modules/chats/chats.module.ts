import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { ChatsController } from './chats.controller';
import { SocketNameSpacerService } from '../../assets/globalServices/socket-namespaser.service';
import { EntityManagerModule } from '../../assets/entitiesManagers/entitiy-manager.module';

@Module({
  imports: [EntityManagerModule],
  controllers: [ChatsController],
  providers: [SocketNameSpacerService, ChatsService, ChatsGateway],
})
export class ChatsModule {}
