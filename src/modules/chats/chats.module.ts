import { Module } from '@nestjs/common';

import { ChatsService } from './chats.service';
import { ChatsWsGateway } from './chats.ws-gateway';
import { ChatsController } from './chats.controller';
import { EntityManagerModule } from '../../sub_modules/entitiesManagers/entitiy-manager.module';
import { GlobalServicesModule } from '../../sub_modules/globalServices/global-services.module';

@Module({
  imports: [EntityManagerModule, GlobalServicesModule],
  controllers: [ChatsController],
  providers: [ChatsService, ChatsWsGateway],
})
export class ChatsModule {}
